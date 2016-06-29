'use strict';

import {StyleSheet, Platform} from 'react-native';
const deepDiffer = require('deepDiffer');

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

// Theme class
class Theme {
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
  }

  add(styles, name = 'default') {
    // Check styles is processed
    var processed = 2;
    for (var key in styles) {
      if (typeof styles[key] === 'number') {
        processed = 1;
      } else {
        processed = 0;
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
  }

  active(name = 'default') {
    if (name !== current && themes.hasOwnProperty(name)) {
      current = name;
      if (rootComponent !== null) {
        rootComponent.forceUpdate();
      }
    }
  }

  setRoot(root) {
    if (typeof root === 'undefined') {
      rootComponent = null;
    } else if (typeof root === 'object' && root.hasOwnProperty('forceUpdate')) {
      rootComponent = root;
    }
  }
}

module.exports = new Theme();
