import rangy from "rangy/lib/rangy-core.js";
import "rangy/lib/rangy-classapplier.js";
import "rangy/lib/rangy-textrange.js";
import XPathUtil from "./XPathUtil";

const IS_LOGGING_ON = true;

function log(msg, level) {
  if (IS_LOGGING_ON) {
    if (level === "warning" && typeof msg === "string") {
      console.log("%c" + msg, "background: yellow; color: black");
    } else if (level === "info" && typeof msg === "string") {
      console.log("%c" + msg, "background: #d9edf7; color: black");
    } else if (level === "error" && typeof msg === "string") {
      console.log("%c" + msg, "color: red");
    } else if (level === "success" && typeof msg === "string") {
      console.log("%c" + msg, "color: green");
    } else {
      console.log(msg);
    }
  }
}

function XRange(rangyObj) {
  if (rangy.initialized === false) {
    rangy.init();
  }

  this.rangyObj = rangyObj ? rangyObj.cloneRange() : rangy.createRange();
  this.setIndex(0); // Index is zero by default.
}

XRange.prototype.moveStart = function (count, unit) {
  var unit = unit || "character";

  this.rangyObj.moveStart(unit, count);
};

XRange.prototype.moveEnd = function (count, unit) {
  var unit = unit || "character";

  this.rangyObj.moveEnd(unit, count);
};

XRange.prototype.getBlockParent = function () {
  let node = this.rangyObj.commonAncestorContainer;
  if (this._getDisplayType(node) === "block") {
    return node;
  } else {
    node = node.parentNode;
    while (this._getDisplayType(node) !== "block") {
      node = node.parentNode;
    }

    return node;
  }
};

XRange.prototype._getDisplayType = function (element) {
  if (element.nodeType != Node.ELEMENT_NODE) return "";

  const cStyle = element.currentStyle || window.getComputedStyle(element, "");
  return cStyle.display;
};

XRange.prototype.copy = function () {
  return new XRange(this.rangyObj.cloneRange());
};

XRange.prototype.serialize = function () {
  try {
    var serialized = {
      startContainerPath: XPathUtil.getXPathFromNode(
        this.rangyObj.startContainer
      ),
      startOffset: this.rangyObj.startOffset,
      endContainerPath: XPathUtil.getXPathFromNode(this.rangyObj.endContainer),
      endOffset: this.rangyObj.endOffset,
      collapsed: this.rangyObj.collapsed,
      textContent: this.textContent(),
    };

    if (this.index) {
      serialized.index = this.index;
    }
  } catch (error) {
    log(error);
    log("Error serializing xRange object", "error");
    log(JSON.stringify(error), "error");
    return null;
  }

  return serialized;
};

XRange.prototype.textContent = function () {
  return this.rangyObj.text();
};

XRange.prototype.setStart = function (startNode, startOffset) {
  this.rangyObj.setStart(startNode, startOffset);
};

XRange.prototype.getStart = function () {
  return this.rangyObj.startOffset;
};

XRange.prototype.getStartContainer = function () {
  return this.rangyObj.startContainer;
};

XRange.prototype.setEnd = function (endNode, endOffset) {
  this.rangyObj.setEnd(endNode, endOffset);
};

XRange.prototype.getEnd = function () {
  return this.rangyObj.endOffset;
};

XRange.prototype.getEndContainer = function () {
  return this.rangyObj.endContainer;
};

XRange.prototype.setIndex = function (index) {
  this.index = index;
};

XRange.prototype.getIndex = function (index) {
  return this.index;
};

// Sometimes, unserializing an object will create a range collapsed to the beginning of the document
XRange.prototype.isAtDocumentStart = function () {
  if (
    this.getEndContainer() === document &&
    this.getStartContainer() === document &&
    this.getEnd() === 0 &&
    this.getStart() === 0
  ) {
    return true;
  }

  return false;
};

XRange.prototype.getNativeRange = function () {
  return this.rangyObj.nativeRange;
};

// Builder
XRange.createFromSelection = function () {
  let xr;

  try {
    const nativeRange = window.getSelection().getRangeAt(0);

    xr = new XRange();
    xr.setStart(nativeRange.startContainer, nativeRange.startOffset);
    xr.setEnd(nativeRange.endContainer, nativeRange.endOffset);
  } catch (error) {
    log("Error creating from selection", "error");
    log(error);
    return null;
  }

  return xr;
};

XRange.createFromNode = function (node) {
  try {
    var xr = new XRange();
    xr.selectNodeContents(node);
  } catch (error) {
    log("Error creating from node", "error");
    log(node);
    return null;
  }

  return xr;
};

XRange.createFromSerialized = function (serialized) {
  try {
    var xr = new XRange();
    xr._unserialize(serialized);

    if (serialized.index) {
      xr.setIndex(serialized.index);
    }

    if (xr.isAtDocumentStart()) {
      return null;
    }
  } catch (error) {
    log("Error unserializing range", "error");
    log(JSON.stringify(serialized), "error");
    log(error, "error");
    return null;
  }

  return xr;
};

XRange.prototype.selectNodeContents = function (node) {
  this.rangyObj.selectNodeContents(node);
};

XRange.prototype._unserialize = function (serialized) {
  let startContainer,
    endContainer,
    endOffset,
    evaluator = new XPathEvaluator();
  startContainer = evaluator.evaluate(
    serialized.startContainerPath,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  if (!startContainer.singleNodeValue) {
    return null;
  }

  if (serialized.collapsed || !serialized.endContainerPath) {
    endContainer = startContainer;
    endOffset = serialized.startOffset;
  } else {
    endContainer = evaluator.evaluate(
      serialized.endContainerPath,
      document.documentElement,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (!endContainer.singleNodeValue) {
      return null;
    }

    endOffset = serialized.endOffset;
  }

  // map to range object
  const range = rangy.createRange();
  range.setStart(startContainer.singleNodeValue, serialized.startOffset);
  range.setEnd(endContainer.singleNodeValue, endOffset);

  this.rangyObj = range;
};

XRange.prototype.indexOf = function (pattern, ignoreChars) {
  if (pattern.length == 0) return null;

  const range = this.rangyObj.cloneRange();

  const isFound = range.findText(pattern, {
    wholeWordsOnly: false,
    characterOptions: {
      ignoreCharacters: ignoreChars ? ignoreChars.join("") : "",
    },
    direction: "backwards", // TODO: Direction cannot be static like this
  });

  return isFound ? new XRange(range) : null;
};

XRange.prototype.getCoordinates = function ({ relativeEl }) {
  const rects = this.getNativeRange().getClientRects();
  const containerRect = relativeEl.getBoundingClientRect();
  const positions = Array.from(rects).map((rect: any) => ({
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  }));
  return positions;
};

export default XRange;