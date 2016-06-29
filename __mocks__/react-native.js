'use strict';

// StyleSheetRegistry
var styles = {};
var uniqueID = 1;
var emptyStyle = {};

class StyleSheetRegistry {
  static registerStyle(style) {
    var id = ++uniqueID;
    styles[id] = style;
    return id;
  }

  static getStyleByID(id: number): Object {
    if (!id) {
      // Used in the style={[condition && id]} pattern,
      // we want it to be a no-op when the value is false or null
      return emptyStyle;
    }

    var style = styles[id];
    if (!style) {
      console.warn('Invalid style with id `' + id + '`. Skipping ...');
      return emptyStyle;
    }
    return style;
  }
}

// flattenStyle
function getStyle(style) {
  if (typeof style === 'number') {
    return StyleSheetRegistry.getStyleByID(style);
  }
  return style;
}

function flattenStyle(style) {
  if (!style) {
    return undefined;
  }

  if (!Array.isArray(style)) {
    return getStyle(style);
  }

  var result = {};
  for (var i = 0, styleLength = style.length; i < styleLength; ++i) {
    var computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (var key in computedStyle) {
        result[key] = computedStyle[key];
      }
    }
  }
  return result;
}

// StyleSheet
var ReactNative = {
  StyleSheet: {
    create: function (obj) {
      var result = {};
      for (var key in obj) {
        result[key] = StyleSheetRegistry.registerStyle(obj[key]);
      }
      return result;
    }, 
    flatten: flattenStyle,
  },
  Platform: {
    OS: 'ios',
  },
};

module.exports = ReactNative;
