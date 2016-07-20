'use strict';

module.exports = {
  createElement: function (type, config, children) {
    var element = {
      type,
      props: config,
    };
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      element.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      element.children = childArray;
    }
    return element;
  }
}
