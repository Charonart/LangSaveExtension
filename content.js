// Content script to get selected text
// This function is injected by background.js via chrome.scripting.executeScript
function getSelectedText() {
  return window.getSelection().toString();
}

