var turndownPluginGfm = (function (exports) {
'use strict';

var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;

function highlightedCodeBlockCustomized(turndownService) {
  turndownService.addRule('highlightedCodeBlockCustomized', {
    filter: function(node) {
      // GitHub style
      if (node.nodeName === 'DIV' &&
          highlightRegExp.test(node.className) &&
          node.firstChild &&
          node.firstChild.nodeName === 'PRE') {
        return true;
      }
      
      // Standalone <pre> tag
      if (node.nodeName === 'PRE') {
        return true;
      }
      
      return false;
    },
    replacement: function(content, node, options) {
      let language = '';
      let codeContent = '';
      
      if (node.nodeName === 'DIV') {
        // GitHub style: extract language from div class
        const className = node.className || '';
        language = (className.match(highlightRegExp) || [null, ''])[1];
        codeContent = node.firstChild.textContent;
      } else {
        // Standalone <pre>
        const className = node.className || '';
        const langMatch = className.match(/(?:language|lang)-([a-z0-9]+)/i) ||
                         className.match(/brush:\s*([a-z0-9]+)/i);
        language = langMatch ? langMatch[1] : '';

        // Some sites use data-language attribute
        if (!language && node.getAttribute('data-language')) {
          language = node.getAttribute('data-language');
        }
        
        // Special handling for code blocks with <br> tags
        if (node.querySelector('br')) {
          // Get the content by replacing <br> with actual newlines
          codeContent = node.innerHTML
            .replace(/<br\s*\/?>/gi, '\n') // Replace <br> tags with newlines
            .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
          // Decode HTML entities
          codeContent = decodeHTMLEntities(codeContent);
        } else {
          codeContent = node.textContent;
        }
      }

      return (
        '\n\n' + options.fence + language + '\n' +
        codeContent +
        '\n' + options.fence + '\n\n'
      );
    }
  });
}

function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function highlightedCodeBlock (turndownService) {
  turndownService.addRule('highlightedCodeBlock', {
    filter: function (node) {
      var firstChild = node.firstChild;
      return (
        node.nodeName === 'DIV' &&
        highlightRegExp.test(node.className) &&
        firstChild &&
        firstChild.nodeName === 'PRE'
      )
    },
    replacement: function (content, node, options) {
      var className = node.className || '';
      var language = (className.match(highlightRegExp) || [null, ''])[1];

      return (
        '\n\n' + options.fence + language + '\n' +
        node.firstChild.textContent +
        '\n' + options.fence + '\n\n'
      )
    }
  });
}

function strikethrough (turndownService) {
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
      return '~' + content + '~'
    }
  });
}

var indexOf = Array.prototype.indexOf;
var every = Array.prototype.every;
var rules = {};

rules.tableCell = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    return cell(content, node)
  }
};

rules.tableRow = {
  filter: 'tr',
  replacement: function (content, node) {
    var borderCells = '';
    var alignMap = { left: ':--', right: '--:', center: ':-:' };

    if (isHeadingRow(node)) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var border = '---';
        var align = (
          node.childNodes[i].getAttribute('align') || ''
        ).toLowerCase();

        if (align) border = alignMap[align] || border;

        borderCells += cell(border, node.childNodes[i]);
      }
    }
    return '\n' + content + (borderCells ? '\n' + borderCells : '')
  }
};

rules.table = {
  // Only convert tables with a heading row.
  // Tables with no heading row are kept using `keep` (see below).
  filter: function (node) {
    return node.nodeName === 'TABLE' && isHeadingRow(node.rows[0])
  },

  replacement: function (content) {
    // Ensure there are no blank lines
    content = content.replace('\n\n', '\n');
    return '\n\n' + content + '\n\n'
  }
};

rules.tableSection = {
  filter: ['thead', 'tbody', 'tfoot'],
  replacement: function (content) {
    return content
  }
};

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
function isHeadingRow (tr) {
  var parentNode = tr.parentNode;
  return (
    parentNode.nodeName === 'THEAD' ||
    (
      parentNode.firstChild === tr &&
      (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
      every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
    )
  )
}

function isFirstTbody (element) {
  var previousSibling = element.previousSibling;
  return (
    element.nodeName === 'TBODY' && (
      !previousSibling ||
      (
        previousSibling.nodeName === 'THEAD' &&
        /^\s*$/i.test(previousSibling.textContent)
      )
    )
  )
}

function cell (content, node) {
  var index = indexOf.call(node.parentNode.childNodes, node);
  var prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content + ' |'
}

function tables (turndownService) {
  turndownService.keep(function (node) {
    return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0])
  });
  for (var key in rules) turndownService.addRule(key, rules[key]);
}

function taskListItems (turndownService) {
  turndownService.addRule('taskListItems', {
    filter: function (node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI'
    },
    replacement: function (content, node) {
      return (node.checked ? '[x]' : '[ ]') + ' '
    }
  });
}

function gfm (turndownService) {
  turndownService.use([
    highlightedCodeBlock,
    strikethrough,
    tables,
    taskListItems
  ]);
}

exports.gfm = gfm;
exports.highlightedCodeBlock = highlightedCodeBlock;
exports.strikethrough = strikethrough;
exports.tables = tables;
exports.taskListItems = taskListItems;
exports.highlightedCodeBlockCustomized = highlightedCodeBlockCustomized;

return exports;

}({}));
