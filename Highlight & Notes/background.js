// Listen for messages from the content script
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "enableHighlightingAndNoteTaking") {
      // Send a response to the content script to confirm that highlighting and note-taking has been enabled
      sendResponse({ message: "Highlighting and note-taking enabled" });
  
      // Send a message to the content script to enable highlighting and note-taking
      browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: "highlightText" });
      });
    }
    else if (request.action === "addNote") {
      // Send a message to the content script to start note-taking
      browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: "addNote" });
      });
    }
  });
  