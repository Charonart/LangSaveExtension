// Popup functionality for LangSave extension

let allWords = [];
let filteredWords = [];
let selectedWords = new Set(); // Track selected words by dateAdded
let collapsedWords = new Set(); // Track collapsed words by dateAdded

// DOM elements
const searchInput = document.getElementById('searchInput');
const wordList = document.getElementById('wordList');
const emptyState = document.getElementById('emptyState');
const exportBtn = document.getElementById('exportBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const selectionControls = document.getElementById('selectionControls');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const expandAllBtn = document.getElementById('expandAllBtn');

// Load words on popup open
document.addEventListener('DOMContentLoaded', () => {
  loadWords();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Search input
  searchInput.addEventListener('input', (e) => {
    filterWords(e.target.value.trim().toLowerCase());
  });

  // Export button
  exportBtn.addEventListener('click', exportSelectedToCSV);

  // Copy all button
  copyAllBtn.addEventListener('click', copyAllToClipboard);

  // Delete selected button
  deleteSelectedBtn.addEventListener('click', deleteSelectedWords);

  // Clear all button
  clearAllBtn.addEventListener('click', clearAllWords);

  // Select all checkbox
  selectAllCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectAllWords();
    } else {
      deselectAllWords();
    }
  });

  // Collapse all button
  collapseAllBtn.addEventListener('click', collapseAllWords);

  // Expand all button
  expandAllBtn.addEventListener('click', expandAllWords);

  // Word list event delegation
  wordList.addEventListener('click', (e) => {
    // Handle checkbox clicks
    if (e.target.classList.contains('word-checkbox')) {
      toggleWordSelection(e.target);
      return;
    }

    // Handle collapse/expand button clicks (button or icon inside)
    const collapseToggle = e.target.closest('.collapse-toggle');
    if (collapseToggle) {
      toggleWordCollapse(collapseToggle);
      return;
    }
  });

  // Auto-save custom definitions on blur
  wordList.addEventListener('blur', (e) => {
    if (e.target.classList.contains('custom-definition-input')) {
      saveCustomDefinition(e.target);
    }
  }, true);

  // Auto-save on Enter (with Shift+Enter for new line)
  wordList.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('custom-definition-input')) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.target.blur();
      }
    }
  });
}

// Load words from storage
function loadWords() {
  chrome.storage.local.get({ words: [] }, (data) => {
    allWords = data.words || [];
    // Sort by date added (newest first)
    allWords.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    filteredWords = [...allWords];
    
    // Set all words as collapsed by default
    collapsedWords.clear();
    allWords.forEach(word => {
      collapsedWords.add(word.dateAdded);
    });
    
    renderWords();
    updateEmptyState();
  });
}

// Filter words based on search query
function filterWords(query) {
  if (!query) {
    filteredWords = [...allWords];
  } else {
    filteredWords = allWords.filter(word => 
      word.word.toLowerCase().includes(query) ||
      word.autoDefinition.toLowerCase().includes(query) ||
      word.customDefinition.toLowerCase().includes(query)
    );
  }
  // Clear selections when filtering (optional - you might want to keep selections)
  // selectedWords.clear();
  renderWords();
  updateEmptyState();
}

// Render word list
function renderWords() {
  wordList.innerHTML = '';

  // Show/hide selection controls based on filtered words
  if (filteredWords.length > 0) {
    selectionControls.classList.remove('hidden');
    updateSelectAllCheckbox();
  } else {
    selectionControls.classList.add('hidden');
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }

  filteredWords.forEach((wordEntry, index) => {
    const li = document.createElement('li');
    li.className = 'word-item';
    li.dataset.dateAdded = wordEntry.dateAdded;
    
    const wordIndex = allWords.findIndex(w => w.word === wordEntry.word && w.dateAdded === wordEntry.dateAdded);
    const isCollapsed = collapsedWords.has(wordEntry.dateAdded);
    const isSelected = selectedWords.has(wordEntry.dateAdded);
    
    li.innerHTML = `
      <div class="word-item-header">
        <label class="word-checkbox-label">
          <input 
            type="checkbox" 
            class="word-checkbox" 
            data-date="${wordEntry.dateAdded}"
            ${isSelected ? 'checked' : ''}
          >
        </label>
        <button class="collapse-toggle" data-date="${wordEntry.dateAdded}" aria-label="Toggle details">
          <span class="collapse-icon ${isCollapsed ? 'collapsed' : 'expanded'}">▼</span>
        </button>
        <div class="word-header-content">
          <h3 class="word-title">${escapeHtml(wordEntry.word)}</h3>
          ${wordEntry.phonetic ? `<span class="word-phonetic">[${escapeHtml(wordEntry.phonetic)}]</span>` : ''}
        </div>
      </div>
      <div class="word-details ${isCollapsed ? 'collapsed' : ''}">
        ${wordEntry.autoDefinition ? `<p class="word-definition">${escapeHtml(wordEntry.autoDefinition)}</p>` : ''}
        <div class="custom-definition-container">
          <label class="custom-definition-label">Your notes:</label>
          <textarea 
            class="custom-definition-input" 
            data-word="${escapeHtml(wordEntry.word)}"
            data-date="${wordEntry.dateAdded}"
            placeholder="Add your custom definition, example, or notes..."
            rows="2"
          >${escapeHtml(wordEntry.customDefinition)}</textarea>
        </div>
      </div>
    `;
    
    wordList.appendChild(li);
  });

  updateDeleteButtonVisibility();
}

// Update empty state visibility
function updateEmptyState() {
  if (filteredWords.length === 0) {
    emptyState.style.display = 'block';
    wordList.style.display = 'none';
    
    if (searchInput.value.trim()) {
      emptyState.querySelector('.empty-message').textContent = 'No words match your search.';
      emptyState.querySelector('.empty-hint').textContent = '';
    } else {
      emptyState.querySelector('.empty-message').textContent = 'No words saved yet.';
      emptyState.querySelector('.empty-hint').textContent = 'Highlight a word and right-click to save it, or use Alt+S';
    }
  } else {
    emptyState.style.display = 'none';
    wordList.style.display = 'block';
  }
}

// Save custom definition
function saveCustomDefinition(textarea) {
  const word = textarea.dataset.word;
  const dateAdded = parseInt(textarea.dataset.date);
  const customDefinition = textarea.value.trim();

  // Find the word in storage and update it
  chrome.storage.local.get({ words: [] }, (data) => {
    const words = data.words || [];
    const wordIndex = words.findIndex(w => w.word === word && w.dateAdded === dateAdded);
    
    if (wordIndex !== -1) {
      words[wordIndex].customDefinition = customDefinition;
      chrome.storage.local.set({ words }, () => {
        // Update local copy
        const allWordIndex = allWords.findIndex(w => w.word === word && w.dateAdded === dateAdded);
        if (allWordIndex !== -1) {
          allWords[allWordIndex].customDefinition = customDefinition;
        }
        
        // Update filtered words if this word is in the filtered list
        const filteredIndex = filteredWords.findIndex(w => w.word === word && w.dateAdded === dateAdded);
        if (filteredIndex !== -1) {
          filteredWords[filteredIndex].customDefinition = customDefinition;
        }
      });
    }
  });
}

// Toggle word collapse/expand
function toggleWordCollapse(button) {
  const dateAdded = parseInt(button.dataset.date);
  const wordItem = button.closest('.word-item');
  const details = wordItem.querySelector('.word-details');
  const icon = button.querySelector('.collapse-icon');
  
  if (collapsedWords.has(dateAdded)) {
    collapsedWords.delete(dateAdded);
    details.classList.remove('collapsed');
    icon.classList.remove('collapsed');
    icon.classList.add('expanded');
  } else {
    collapsedWords.add(dateAdded);
    details.classList.add('collapsed');
    icon.classList.remove('expanded');
    icon.classList.add('collapsed');
  }
}

// Collapse all words
function collapseAllWords() {
  filteredWords.forEach(word => {
    collapsedWords.add(word.dateAdded);
  });
  
  // Update UI
  document.querySelectorAll('.word-item').forEach(item => {
    const dateAdded = parseInt(item.dataset.dateAdded);
    const details = item.querySelector('.word-details');
    const icon = item.querySelector('.collapse-icon');
    
    if (details && icon) {
      details.classList.add('collapsed');
      icon.classList.remove('expanded');
      icon.classList.add('collapsed');
    }
  });
}

// Expand all words
function expandAllWords() {
  filteredWords.forEach(word => {
    collapsedWords.delete(word.dateAdded);
  });
  
  // Update UI
  document.querySelectorAll('.word-item').forEach(item => {
    const dateAdded = parseInt(item.dataset.dateAdded);
    const details = item.querySelector('.word-details');
    const icon = item.querySelector('.collapse-icon');
    
    if (details && icon) {
      details.classList.remove('collapsed');
      icon.classList.remove('collapsed');
      icon.classList.add('expanded');
    }
  });
}

// Toggle word selection
function toggleWordSelection(checkbox) {
  const dateAdded = parseInt(checkbox.dataset.date);
  
  if (checkbox.checked) {
    selectedWords.add(dateAdded);
  } else {
    selectedWords.delete(dateAdded);
  }
  
  updateSelectAllCheckbox();
  updateDeleteButtonVisibility();
}

// Select all words
function selectAllWords() {
  filteredWords.forEach(word => {
    selectedWords.add(word.dateAdded);
  });
  
  // Update all checkboxes
  document.querySelectorAll('.word-checkbox').forEach(checkbox => {
    checkbox.checked = true;
  });
  
  updateDeleteButtonVisibility();
}

// Deselect all words
function deselectAllWords() {
  filteredWords.forEach(word => {
    selectedWords.delete(word.dateAdded);
  });
  
  // Update all checkboxes
  document.querySelectorAll('.word-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  updateDeleteButtonVisibility();
}

// Update select all checkbox state
function updateSelectAllCheckbox() {
  if (filteredWords.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }
  
  const selectedCount = filteredWords.filter(w => selectedWords.has(w.dateAdded)).length;
  
  if (selectedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (selectedCount === filteredWords.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

// Update delete button visibility
function updateDeleteButtonVisibility() {
  // Count only selected words that are in the filtered list
  const selectedInFiltered = filteredWords.filter(w => selectedWords.has(w.dateAdded)).length;
  
  if (selectedWords.size > 0) {
    deleteSelectedBtn.classList.remove('btn-hidden');
    if (selectedInFiltered > 0) {
      exportBtn.textContent = `Export Selected (${selectedInFiltered})`;
    } else {
      // If no filtered words are selected but some words are selected overall
      exportBtn.textContent = `Export Selected (${selectedWords.size})`;
    }
  } else {
    deleteSelectedBtn.classList.add('btn-hidden');
    exportBtn.textContent = 'Export Selected';
  }
}

// Export selected words to CSV
function exportSelectedToCSV() {
  chrome.storage.local.get({ words: [] }, (data) => {
    let words = data.words || [];
    
    // If there are selected words, export only those
    if (selectedWords.size > 0) {
      words = words.filter(word => selectedWords.has(word.dateAdded));
    }
    
    if (words.length === 0) {
      alert('No words selected to export.');
      return;
    }

    // CSV headers
    const headers = ['Word', 'Phonetic', 'Auto-Definition', 'Custom-Definition', 'Date Added'];
    
    // CSV rows
    const rows = words.map(word => {
      const dateAdded = word.dateAdded ? new Date(word.dateAdded).toISOString() : '';
      return [
        escapeCSV(word.word),
        escapeCSV(word.phonetic || ''),
        escapeCSV(word.autoDefinition || ''),
        escapeCSV(word.customDefinition || ''),
        escapeCSV(dateAdded)
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const countText = selectedWords.size > 0 ? `_${selectedWords.size}_selected` : '_all';
    link.download = `LangSave_Words${countText}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Delete selected words
function deleteSelectedWords() {
  if (selectedWords.size === 0) {
    alert('No words selected to delete.');
    return;
  }

  const count = selectedWords.size;
  if (!confirm(`Are you sure you want to delete ${count} word${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
    return;
  }

  chrome.storage.local.get({ words: [] }, (data) => {
    const words = data.words || [];
    const remainingWords = words.filter(word => !selectedWords.has(word.dateAdded));
    
    chrome.storage.local.set({ words: remainingWords }, () => {
      // Clear selections
      selectedWords.clear();
      
      // Reload words
      loadWords();
      searchInput.value = '';
      
      // Show temporary feedback
      const originalText = deleteSelectedBtn.textContent;
      deleteSelectedBtn.textContent = 'Deleted!';
      deleteSelectedBtn.disabled = true;
      setTimeout(() => {
        deleteSelectedBtn.textContent = originalText;
        deleteSelectedBtn.disabled = false;
      }, 2000);
    });
  });
}

// Copy all words to clipboard
function copyAllToClipboard() {
  chrome.storage.local.get({ words: [] }, (data) => {
    const words = data.words || [];
    
    if (words.length === 0) {
      alert('No words to copy.');
      return;
    }

    const text = words.map((word, index) => {
      let result = `${index + 1}. ${word.word}`;
      if (word.phonetic) {
        result += ` [${word.phonetic}]`;
      }
      if (word.autoDefinition) {
        result += `\n   Definition: ${word.autoDefinition}`;
      }
      if (word.customDefinition) {
        result += `\n   Your notes: ${word.customDefinition}`;
      }
      return result;
    }).join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      // Show temporary feedback
      const originalText = copyAllBtn.textContent;
      copyAllBtn.textContent = 'Copied!';
      copyAllBtn.disabled = true;
      setTimeout(() => {
        copyAllBtn.textContent = originalText;
        copyAllBtn.disabled = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please try again.');
    });
  });
}

// Clear all words
function clearAllWords() {
  if (confirm('Are you sure you want to clear all saved words? This action cannot be undone.')) {
    chrome.storage.local.set({ words: [] }, () => {
      allWords = [];
      filteredWords = [];
      renderWords();
      updateEmptyState();
      searchInput.value = '';
      
      // Show temporary feedback
      const originalText = clearAllBtn.textContent;
      clearAllBtn.textContent = 'Cleared!';
      clearAllBtn.disabled = true;
      setTimeout(() => {
        clearAllBtn.textContent = originalText;
        clearAllBtn.disabled = false;
      }, 2000);
    });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Escape CSV values (handle quotes and commas)
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

