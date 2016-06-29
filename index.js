'use strict';

import {StyleSheet, Platform} from 'react-native';
const deepDiffer = require('./lib/deepDiffer');

var themes = {};
var proxies = {};
var current = 'default';
var rootComponent = null;

// Utilities Functions
function styleHasFunction(style) {
  for (var key in style) {
    if (typeof style[key] === 'function') {
      return true;
    } else if (typeof style[key] === 'object') {
      if (styleHasFunction(style[key])) {
        return true;
      }
    }
  }
  return false;
}

function platformSpecific(styles) {
  const result = {};
  for (var key in styles) {
    let {ios, android, windows, web, ...style} = {...styles[key]};
    result[key] = styles[key][Platform.OS] ?
      {...style, ...styles[key][Platform.OS]} :
      style;
  }
  return result;
}

// Theme class
const Theme = {
  get styles() {
    if (current === 'default') {
      if (themes.hasOwnProperty(current)) {
        return themes.default;
      }
      proxies.default = {};
    }
    if (!proxies.hasOwnProperty(current)) {
      if (themes.hasOwnProperty('default')) {
        proxies[current] = Object.assign({}, themes.default, themes[current]);
      } else {
        return themes[current];
      }
    }
    return proxies[current];
  },

  get name() {
    return current;
  },

  add(styles, name = 'default') {
    // Check styles is processed
    var processed = 2;
    for (var key in styles) {
      if (typeof styles[key] === 'number') {
        processed = 1;
      } else {
        processed = 0;
        // Platform Specific
        styles = platformSpecific(styles);
      }
      break;
    }
    if (processed === 2) {
      return 2;
    }
    // Add new theme
    if (!themes.hasOwnProperty(name)) {
      themes[name] = processed ? styles : StyleSheet.create(styles);
      return 0;
    }
    // Merge theme
    var theme = themes[name];
    for (var key in styles) {
      var style = styles[key];
      if (theme.hasOwnProperty(key)) {
        var style_obj = StyleSheet.flatten([theme[key], style]);
        if (styleHasFunction(StyleSheet.flatten(style))) {
          theme[key] = StyleSheet.create({
              style: style_obj
            }).style;
        } else if (deepDiffer(StyleSheet.flatten(theme[key]), style_obj)) {
          if (typeof style !== 'number' || deepDiffer(style_obj, StyleSheet.flatten(style))) {
            theme[key] = StyleSheet.create({
              style: style_obj
            }).style;
          } else {
            theme[key] = style;
          }
        }
      } else {
        theme[key] = typeof style === 'number'?
          style:
          StyleSheet.create({style}).style;
      }
    }
    // Clear proxies cache
    if (name !== 'default' && proxies.hasOwnProperty(name)) {
      delete proxies[name];
    }
    return 0;
  },

  active(name = 'default') {
    if (name !== current && themes.hasOwnProperty(name)) {
      current = name;
      if (rootComponent !== null) {
        rootComponent.forceUpdate();
      }
    } else {
      if (name !== current) {
        console.warn('You must add theme data before active it.');
      }
      console.warn('Activated theme: ' + current);
    }
  },

  setRoot(root) {
    if (typeof root === 'undefined') {
      rootComponent = null;
    } else if (typeof root === 'object' && root.hasOwnProperty('forceUpdate')) {
      rootComponent = root;
    } else {
      console.warn('setRoot: root must be a react native component or undefined');
    }
  },

  css(styles) {
    if (typeof styles === 'string' || Array.isArray(styles)) {
      if (typeof styles === 'string') {
        var result = styles.split(' ').map(function(name) {
          if (name.length !== 0 && Theme.styles.hasOwnProperty(name)) {
            return Theme.styles[name];
          }
          return 0;
        }).filter(function(style) {
          return style;
        });
      } else {
        var result = [];
        for (var i = 0, styleLength = styles.length; i < styleLength; ++i) {
          var computed = Theme.css(styles[i]);
          if (Array.isArray(computed)) {
            Array.prototype.push.apply(result, computed);
          } else if (computed !== 0) {
            result.push(computed);
          }
        }
      }
      if (result.length === 0) {
        return 0;
      } else if (result.length === 1) {
        return result[0];
      }
      return result;
    }
    return styles;
  },
};

module.exports = Theme;
