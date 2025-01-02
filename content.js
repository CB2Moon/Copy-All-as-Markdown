// Initialize TurndownService with custom options
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
    fence: '```',
    preformattedCode: true
});

// Use the gfm plugin
turndownService.use([
    turndownPluginGfm.highlightedCodeBlockCustomized,
    turndownPluginGfm.tables,
    turndownPluginGfm.strikethrough,
    turndownPluginGfm.gfm
]);

// Function to convert HTML to Markdown and copy to clipboard
function convertToMarkdown() {
    try {
        const content = getContentToConvert();
        const markdown = turndownService.turndown(content);

        // Copy to clipboard
        navigator.clipboard.writeText(markdown).then(() => {
            showNotification('Success', 'Converted to Markdown and copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            showNotification('Error', 'Failed to copy to clipboard. Please check permissions.');
            throw err;
        });
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification('Error', 'Failed to convert content. Please try again.');
    }
}

// Function to get selected text or main content
function getContentToConvert() {
    try {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            return container.innerHTML;
        }
        return getMainContent();
    } catch (error) {
        console.error('Error getting content:', error);
        throw new Error('Failed to get content for conversion');
    }
}

// Function to get the main content using Readability
function getMainContent() {
    try {
        const documentClone = document.cloneNode(true);
        const article = new Readability(documentClone, {
            keepClasses: true
        }).parse();
        if (!article) {
            throw new Error('Failed to parse main content');
        }
        let content = article.content;
        if (article.title) {
            content = `<h1>${article.title}</h1>\n\n${content}`;
        }
        return content;
    } catch (error) {
        console.error('Error extracting main content:', error);
        return document.body.innerHTML;
    }
}

// Function to show notification using Chrome API
function showNotification(title, message) {
    chrome.runtime.sendMessage({
        action: 'showNotification',
        title: title,
        message: message
    });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "convertToMarkdown") {
        try {
            convertToMarkdown();
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error in message listener:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Keep the message channel open for async response
});
