'use strict';

const React = require('React');

const layouts = {};

/**
 * Add modify function for each layout with key
 */
function addModify(layout, keyPrefix = '') {
  if (typeof layout !== 'object') {
    console.warn('Expected argument to be an object.');
    return;
  }
  
  var layoutKeys = Object.keys(layout);
  for (var i = 0; i < layoutKeys.length; i++) {
    var layoutKey = layoutKeys[i];
    var modifies = layout[layoutKey];
    if (typeof modifies === 'function') {
      var key = keyPrefix + layoutKey;
      if (layouts.hasOwnProperty(key)) {
        layouts[key].push(modifies);
      } else {
        layouts[key] = [modifies];
      }
    } else if (typeof modifies === 'object') {
      addModify(modifies, keyPrefix + layoutKey + '_');
    }
  }
}

if (typeof global._createRNElement === 'undefined') {
  global._createRNElement = function(type, config, child) {
    // Process children
    var childrenLength = arguments.length - 2;
    var children = Array(childrenLength > 0 ? childrenLength : 0);
    if (childrenLength === 1) {
      children[0] = child;
    } else if (childrenLength > 1) {
      for (var i = 0; i < childrenLength; i++) {
        children[i] = arguments[i + 2];
      }
    }

    // Apply modifies
    var result = {
      type,
      config,
      children,
      stopRender: false
    }; // {stopRender: boolean, element: Component}
    var layoutContext = config && config.layoutContext;
    var params = [result];
    var applyModify = function (key) {
      if (layouts.hasOwnProperty(key)) {
        var modifies = layouts[key];
        for (var i = 0; i < modifies.length; i++) {
          modifies[i].apply(layoutContext, params);
        }
      }
    };

    // Global modifies
    applyModify('global');

    // Key dependent modifies
    if (config && config.hasOwnProperty('layoutKey')) {
      applyModify(config.layoutKey);
      // Delete config
      delete config.layoutKey;
      delete config.layoutContext;
    }

    if (result.stopRender) {
      return null;
    } else if (typeof result.element === 'object') {
      return result.element;
    }

    // Recorrect config
    config = result.config;
    return React.createElement.apply(React, [type, config].concat(children));
  }
}

module.exports = addModify;
