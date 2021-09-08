import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import invariant from 'invariant';
import styleObjectFunction from './util/styleObjectFunction';
import accumulateFunction from './util/accumulateFunction';
import getElementHTML from './util/getElementHTML';
import rangeSort from './util/rangeSort';
import defaultInlineHTML from './default/defaultInlineHTML';

var subtractStyles = function subtractStyles(original, toRemove) {
  return original.filter(function (el) {
    return !toRemove.some(function (elToRemove) {
      return elToRemove.style === el.style;
    });
  });
};

var popEndingStyles = function popEndingStyles(styleStack, endingStyles) {
  return endingStyles.reduceRight(function (stack, style) {
    var styleToRemove = stack[stack.length - 1];
    invariant(styleToRemove.style === style.style, "Style ".concat(styleToRemove.style, " to be removed doesn't match expected ").concat(style.style));
    return stack.slice(0, -1);
  }, styleStack);
};

var characterStyles = function characterStyles(offset, ranges) {
  return ranges.filter(function (range) {
    return offset >= range.offset && offset < range.offset + range.length;
  });
};

var rangeIsSubset = function rangeIsSubset(firstRange, secondRange) {
  // returns true if the second range is a subset of the first
  var secondStartWithinFirst = firstRange.offset <= secondRange.offset;
  var secondEndWithinFirst = firstRange.offset + firstRange.length >= secondRange.offset + secondRange.length;
  return secondStartWithinFirst && secondEndWithinFirst;
};

var latestStyleLast = function latestStyleLast(s1, s2) {
  // make sure longer-lasting styles are added first
  var s2endIndex = s2.offset + s2.length;
  var s1endIndex = s1.offset + s1.length;
  return s2endIndex - s1endIndex;
};

var getStylesToReset = function getStylesToReset(remainingStyles, newStyles) {
  var i = 0;

  while (i < remainingStyles.length) {
    if (newStyles.every(rangeIsSubset.bind(null, remainingStyles[i]))) {
      i++;
    } else {
      return remainingStyles.slice(i);
    }
  }

  return [];
};

var appendStartMarkup = function appendStartMarkup(inlineHTML, string, styleRange) {
  return string + getElementHTML(inlineHTML(styleRange.style)).start;
};

var prependEndMarkup = function prependEndMarkup(inlineHTML, string, styleRange) {
  return getElementHTML(inlineHTML(styleRange.style)).end + string;
};

var defaultCustomInlineHTML = function defaultCustomInlineHTML(next) {
  return function (style) {
    return next(style);
  };
};

defaultCustomInlineHTML.__isMiddleware = true;
export default (function (rawBlock) {
  var customInlineHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultCustomInlineHTML;
  invariant(rawBlock !== null && rawBlock !== undefined, 'Expected raw block to be non-null');
  var inlineHTML;

  if (customInlineHTML.__isMiddleware === true) {
    inlineHTML = customInlineHTML(defaultInlineHTML);
  } else {
    inlineHTML = accumulateFunction(styleObjectFunction(customInlineHTML), styleObjectFunction(defaultInlineHTML));
  }

  var result = '';
  var styleStack = [];
  var sortedRanges = rawBlock.inlineStyleRanges.sort(rangeSort);

  var originalTextArray = _toConsumableArray(rawBlock.text);

  for (var i = 0; i < originalTextArray.length; i++) {
    var styles = characterStyles(i, sortedRanges);
    var endingStyles = subtractStyles(styleStack, styles);
    var newStyles = subtractStyles(styles, styleStack);
    var remainingStyles = subtractStyles(styleStack, endingStyles); // reset styles: look for any already existing styles that will need to
    // end before styles that are being added on this character. to solve this
    // close out those current tags and all nested children,
    // then open new ones nested within the new styles.

    var resetStyles = getStylesToReset(remainingStyles, newStyles);
    var openingStyles = resetStyles.concat(newStyles).sort(latestStyleLast);
    var openingStyleTags = openingStyles.reduce(appendStartMarkup.bind(null, inlineHTML), '');
    var endingStyleTags = endingStyles.concat(resetStyles).reduce(prependEndMarkup.bind(null, inlineHTML), '');
    result += endingStyleTags + openingStyleTags + originalTextArray[i];
    styleStack = popEndingStyles(styleStack, resetStyles.concat(endingStyles));
    styleStack = styleStack.concat(openingStyles);
    invariant(styleStack.length === styles.length, "Character ".concat(i, ": ").concat(styleStack.length - styles.length, " styles left on stack that should no longer be there"));
  }

  result = styleStack.reduceRight(function (res, openStyle) {
    return res + getElementHTML(inlineHTML(openStyle.style)).end;
  }, result);
  return result;
});