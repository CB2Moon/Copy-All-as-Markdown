# Copy All as Markdown Extension

This lightweight Chromium extension converts HTML content to Markdown format and copies it to your clipboard.
It can convert either selected text or automatically extract and convert the main content of a webpage.

Convenient for writing AI prompts.

Chrome Web Store and Miscrosoft Edge Add-ons are under review.

## Features

- Keyboard shortcut support (Alt+C / Option+C)
- Convert selected HTML text to Markdown
- Automatically extract and convert main content when no text is selected
- Support for various HTML elements including:
  - Headings
  - Lists
  - Tables
  - Code blocks
  - Inline code
  - Links
  - Images
- Clipboard integration=

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

There are two ways to use the extension:

1. Click the extension icon in the toolbar
2. Use the keyboard shortcut Alt+C (Option+C on Mac)

When activated, the extension will:
- Convert selected text if any text is selected
- Extract and convert the main content of the page if no text is selected
- Automatically copy the converted Markdown to your clipboard

## Dependencies

This extension uses:
- Turndown.js for HTML to Markdown conversion
- Mozilla's Readability.js for main content extraction

## Required Files

Before using the extension, make sure to download and place these libraries in the `lib` directory:
- `lib/turndown.js` - Get it from [TurndownJS](https://github.com/mixmark-io/turndown/blob/master/src/turndown.js)
- `lib/turndown-plugin-gfm.js` - Get it from [TurndownJS](https://github.com/mixmark-io/turndown-plugin-gfm/tree/master/src) *(I've modified the highlightedCodeBlock plugin)*
- `lib/Readability.js` - Get it from [Mozilla's Readability](https://github.com/mozilla/readability/blob/main/Readability.js)

## License

MIT License
