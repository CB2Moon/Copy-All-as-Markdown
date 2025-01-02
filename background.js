// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "convertToMarkdown" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            showNotification('Error', 'Failed to access the page. Please refresh and try again.');
        }
    });
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "convert-to-markdown") {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab) {
            showNotification('Error', 'No active tab found.');
            return;
        }
        chrome.tabs.sendMessage(tab.id, { action: "convertToMarkdown" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                showNotification('Error', 'Failed to access the page. Please refresh and try again.');
            }
        });
    }
});

// Function to show Chrome notifications
function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: title,
        message: message
    });
}
