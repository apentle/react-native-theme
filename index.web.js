'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const { StyleSheet, Platform } = require('react-native');
const deepDiffer = require('./lib/deepDiffer.web.js');

var _themes = {};
var _proxies = {};
var _components = {};
var _current = 'default';
var _rootComponent = null;

/**
 * styleHasFunction - check style object has function
 *
 * @param  {object} style object
 * @returns {boolean}
 */
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

/**
 * platformSpecific - allow platforms specific styles
 *
 * @param  {object} styles input styles object
 * @returns {object}       styles object for a specific platform
 */
function platformSpecific(styles) {
  const result = {};
  for (var key in styles) {
    var platforms = ['ios', 'android', 'windows', 'web'];
    var styles_key = styles[key];
    var style = {};
    for (var i in styles_key) {
      if (platforms.indexOf(i) === -1) {
        style[i] = styles_key[i];
      }
    }
    result[key] = styles_key.hasOwnProperty(Platform.OS) ? _extends({}, style, styles_key[Platform.OS]) : style;
  }
  return result;
}

/**
 * defineComponent - private define theme component
 *
 * @param  {object} type component's type
 * @returns {undefined}
 */
function defineComponent(type) {
  Object.defineProperty(Theme, type, {
    get: function () {
      if (_components[_current] !== undefined && _components[_current][type] !== undefined) {
        var component = _components[_current][type];
        if (typeof component === 'function' && component.prototype.isReactComponent === undefined) {
          component = component();
          _components[_current][type] = component;
        }
        return component;
      }
      if (_current !== 'default' && _components.default !== undefined) {
        var component = _components.default[type];
        if (typeof component === 'function' && component.prototype.isReactComponent === undefined) {
          component = component();
          _components.default[type] = component;
        }
        return component;
      }
      return undefined;
    }
  });
}

// Theme class
const Theme = {
  /**
   * styles - get styles depend on theme
   *
   * @returns {object}  StyleSheet object
   */
  get styles() {
    if (_current === 'default') {
      if (_themes.default !== undefined) {
        return _themes.default;
      }
      _proxies.default = {};
    }
    if (_proxies[_current] === undefined) {
      if (_themes.default !== undefined) {
        _proxies[_current] = _extends({}, _themes.default, _themes[_current]);
      } else {
        return _themes[_current];
      }
    }
    return _proxies[_current];
  },

  /**
   * name - get current theme name
   *
   * @returns {string}
   */
  get name() {
    return _current;
  },

  /**
   * add - add style for a theme
   *
   * @param  {object} styles           styles to add
   * @param  {string} name = 'default' theme's name
   * @returns {number}
   */
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
    if (_themes[name] === undefined) {
      _themes[name] = processed ? styles : StyleSheet.create(styles);
      return 0;
    }
    // Merge theme
    var theme = _themes[name];
    for (var key in styles) {
      var style = styles[key];
      if (theme[key] !== undefined) {
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
        theme[key] = typeof style === 'number' ? style : StyleSheet.create({ style }).style;
      }
    }
    // Clear proxies cache
    if (name !== 'default' && _proxies[name] !== undefined) {
      delete _proxies[name];
    }
    return 0;
  },

  /**
   * active - active a theme by name
   *
   * @param  {string} name = 'default' theme's name
   * @returns {undefined}
   */
  active(name = 'default') {
    if (name !== _current && _themes[name] !== undefined) {
      _current = name;
      if (_rootComponent !== null) {
        _rootComponent.forceUpdate();
      }
    } else {
      if (name !== _current) {
        console.warn('You must add theme data before active it.');
      }
      console.warn('Activated theme: ' + _current);
    }
  },

  /**
   * setRoot - set a component to be root of theme
   *
   * @param  {object} root component
   * @returns {undefined}
   */
  setRoot(root) {
    if (typeof root === 'undefined') {
      _rootComponent = null;
    } else if (typeof root === 'object' && typeof root.forceUpdate === 'function') {
      _rootComponent = root;
    } else {
      console.warn('setRoot: root must be a react native component or undefined');
    }
  },

  /**
   * css - transform mixed styles in to RN styles object
   *
   * @param  {object} styles mixed styles
   * @returns {object}       react native styles
   */
  css(styles) {
    if (typeof styles === 'string' || Array.isArray(styles)) {
      if (typeof styles === 'string') {
        var result = styles.split(' ').map(function (name) {
          if (name.length !== 0 && Theme.styles[name] !== undefined) {
            return Theme.styles[name];
          }
          return 0;
        }).filter(function (style) {
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

  /**
   * addComponents - add components to a theme
   *
   * @param  {object} components       components object {name: component}
   * @param  {string} name = 'default' theme's name
   * @returns {undefined}
   */
  addComponents(components, name = 'default') {
    if (typeof components !== 'object') {
      console.warn('Expected argument to be an object.');
      return;
    }
    if (_components[name] === undefined) {
      _components[name] = {};
    }
    var theme = _components[name];

    var types = Object.keys(components);
    for (var i = 0, typesLength = types.length; i < typesLength; i++) {
      var type = types[i];
      theme[type] = components[type];
      Theme[type] !== undefined || defineComponent(type);
    }
  },

  /**
   * reset - reset themes data
   */
  reset() {
    _themes = {};
    _proxies = {};
    _components = {};
  }
};

module.exports = Theme;
