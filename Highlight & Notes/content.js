// Get the current active tab
browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    // Send a message to the content script to enable highlighting and note-taking
    browser.tabs.sendMessage(tabs[0].id, { action: "enableHighlightingAndNoteTaking" }).then(function() {
        console.log("Message sent to content script");
    }).catch(function() {
        console.log("Message not sent to content script");
    });
});

// Wait for the content script to be loaded before enabling highlighting and note-taking
document.addEventListener("DOMContentLoaded", function() {
    browser.runtime.sendMessage({ action: "enableHighlightingAndNoteTaking" }).then(function() {
        console.log("Message sent to background script");
    }).catch(function() {
        console.log("Message not sent to background script");
    });
});
  
// Listen for messages from the content script
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message from content script:", request);
    if (request.action === "highlightText") {
        // Highlight the selected text with a yellow background color
        document.designMode = "on";
        var range = window.getSelection().getRangeAt(0);
        var highlight = document.createElement("span");
        highlight.style.backgroundColor = "yellow";
        highlight.appendChild(range.extractContents());
        range.insertNode(highlight);
        document.designMode = "off";
        
        // Save the highlighted text to local storage
        var highlights = JSON.parse(localStorage.getItem("highlights")) || [];
        highlights.push({ text: highlight.textContent, url: window.location.href });
        localStorage.setItem("highlights", JSON.stringify(highlights));
    } else if (request.action === "addNote") {
        // Add a note to the selected text
        var range = window.getSelection().getRangeAt(0);
        var note = prompt("Add a note:");
        var noteElement = document.createElement("span");
        noteElement.style.backgroundColor = "lightblue";
        noteElement.textContent = " (" + note + ")";
        range.insertNode(noteElement);
        
        // Save the note to local storage
        var notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push({ text: note, url: window.location.href });
        localStorage.setItem("notes", JSON.stringify(notes));
    }
});
