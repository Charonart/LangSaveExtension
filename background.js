// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToLangSave",
    title: "Save to LangSave",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToLangSave") {
    let selectedText = info.selectionText;
    
    // For PDF viewer or when selectionText is not available, try to get it from page
    if (!selectedText || selectedText.trim() === '') {
      if (tab && tab.id) {
        // Try to get selection from active tab (especially for PDF viewer)
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            // Try multiple methods to get selected text
            const selection = window.getSelection();
            if (selection && selection.toString().trim()) {
              return selection.toString().trim();
            }
            
            // Try document.getSelection for PDF viewer
            const docSelection = document.getSelection();
            if (docSelection && docSelection.toString().trim()) {
              return docSelection.toString().trim();
            }
            
            // Try getting from PDF.js viewer if available
            if (typeof PDFViewerApplication !== 'undefined') {
              if (PDFViewerApplication.findController && PDFViewerApplication.findController.selectedText) {
                return PDFViewerApplication.findController.selectedText.trim();
              }
            }
            
            // Try accessing PDF text layer
            const textLayer = document.querySelector('.textLayer');
            if (textLayer) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const text = range.toString().trim();
                if (text) return text;
              }
            }
            
            return null;
          }
        }, (results) => {
          if (results && results[0] && results[0].result) {
            saveWord(results[0].result);
          } else {
            // Last resort: use clipboard
            useClipboardFallback();
          }
        });
      } else {
        useClipboardFallback();
      }
    } else {
      saveWord(selectedText.trim());
    }
  }
});

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
  if (command === "save_word") {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // Execute script to get selected text directly (works for PDF viewer too)
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            // Try standard selection first
            let text = window.getSelection().toString().trim();
            if (text) return text;
            
            // Try document selection
            text = document.getSelection().toString().trim();
            if (text) return text;
            
            // Try PDF.js API if available
            if (typeof PDFViewerApplication !== 'undefined') {
              if (PDFViewerApplication.findController && PDFViewerApplication.findController.selectedText) {
                text = PDFViewerApplication.findController.selectedText.trim();
                if (text) return text;
              }
            }
            
            // Try accessing PDF text layer
            const textLayer = document.querySelector('.textLayer');
            if (textLayer) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                text = range.toString().trim();
                if (text) return text;
              }
            }
            
            return null;
          }
        }, (results) => {
          if (results && results[0] && results[0].result) {
            const selectedText = results[0].result;
            if (selectedText) {
              saveWord(selectedText);
            } else {
              useClipboardFallback();
            }
          } else {
            useClipboardFallback();
          }
        });
      }
    });
  }
});

// Save word with definition
async function saveWord(word) {
  // Clean the word: remove extra spaces, punctuation at edges
  const cleanWord = word.trim().replace(/^[^\w]+|[^\w]+$/g, '');
  
  if (!cleanWord) {
    showNotification("Invalid word", "Please select a valid word to save.");
    return;
  }

  // Check if word already exists
  const data = await chrome.storage.local.get({ words: [] });
  const existingWord = data.words.find(w => w.word.toLowerCase() === cleanWord.toLowerCase());
  
  if (existingWord) {
    showNotification("Word already saved", `"${cleanWord}" is already in your collection.`);
    return;
  }

  // Show loading notification
  showNotification("Saving word", `Fetching definition for "${cleanWord}"...`);

  try {
    // Fetch definition from API
    const definition = await fetchDefinition(cleanWord);
    
    // Create word entry
    const wordEntry = {
      word: cleanWord,
      phonetic: definition.phonetic || "",
      autoDefinition: definition.definition || "",
      customDefinition: "",
      dateAdded: Date.now()
    };

    // Save to storage
    const currentData = await chrome.storage.local.get({ words: [] });
    currentData.words.push(wordEntry);
    await chrome.storage.local.set({ words: currentData.words });

    showNotification("Word saved", `"${cleanWord}" has been saved successfully!`);
  } catch (error) {
    console.error("Error saving word:", error);
    // Save word without definition if API fails
    const wordEntry = {
      word: cleanWord,
      phonetic: "",
      autoDefinition: "",
      customDefinition: "",
      dateAdded: Date.now()
    };

    const currentData = await chrome.storage.local.get({ words: [] });
    currentData.words.push(wordEntry);
    await chrome.storage.local.set({ words: currentData.words });

    showNotification("Word saved (no definition)", `"${cleanWord}" saved, but definition could not be fetched.`);
  }
}

// Fetch definition from Free Dictionary API
async function fetchDefinition(word) {
  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      
      // Get phonetic
      let phonetic = "";
      if (entry.phonetic) {
        phonetic = entry.phonetic;
      } else if (entry.phonetics && entry.phonetics.length > 0) {
        phonetic = entry.phonetics.find(p => p.text)?.text || entry.phonetics[0].text || "";
      }

      // Get first definition from first meaning
      let definition = "";
      if (entry.meanings && entry.meanings.length > 0) {
        const firstMeaning = entry.meanings[0];
        if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
          definition = firstMeaning.definitions[0].definition || "";
        }
      }

      return { phonetic, definition };
    }
    
    return { phonetic: "", definition: "" };
  } catch (error) {
    console.error("Error fetching definition:", error);
    throw error;
  }
}

// Clipboard fallback method for PDF viewer
async function useClipboardFallback() {
  try {
    // Request clipboard read
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText && clipboardText.trim()) {
      saveWord(clipboardText.trim());
      showNotification("Using clipboard", "Text saved from clipboard. Make sure you copied the text first.");
    } else {
      showNotification("No text found", "Please highlight and copy the text first, then try again.");
    }
  } catch (error) {
    console.error("Clipboard access error:", error);
    showNotification("Cannot access clipboard", "Please manually copy the text, then paste it in the extension popup or try right-clicking after selecting text.");
  }
}

// Show notification
function showNotification(title, message) {
  const notificationOptions = {
    type: "basic",
    title: title,
    message: message,
    iconUrl: chrome.runtime.getURL("icons/icon48.png")
  };
  
  chrome.notifications.create(notificationOptions, (notificationId) => {
    if (chrome.runtime.lastError) {
      // If icon doesn't exist or notification fails, just log error
      // Extension will continue to work without notifications
      console.log("Notification:", title, "-", message);
      console.log("Note: Install icon files for visual notifications");
    }
  });
}
