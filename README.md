# react-native-theme
[![Build Status](https://travis-ci.org/apentle/react-native-theme.svg?branch=master)](https://travis-ci.org/apentle/react-native-theme) [![Coverage Status](https://coveralls.io/repos/github/apentle/react-native-theme/badge.svg?branch=master)](https://coveralls.io/github/apentle/react-native-theme?branch=master) [![npm version](https://badge.fury.io/js/react-native-theme.svg)](https://badge.fury.io/js/react-native-theme)

Theme manager for react native project!

![ios Theme Change](https://raw.githubusercontent.com/apentle/react-native-theme-example/master/screenshot1.gif)

## Installation
```bash
npm i --save react-native-theme
```

## Usage
Register a theme
```javascript
import theme from 'react-native-theme';

theme.add({ // Add default theme
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
  },
  ...
});

theme.add({ // Add red theme
  title: {
    fontSize: 20,
    color: 'red',
  },
  ...
}, 'red');
```

Use theme as stylesheets
```javascript
import { styles } from 'react-native-theme';

...
<View style={styles.container}>
</View>
...
```

## Platform Styles Support
You can also add specific style for different platforms like this:
```javascript
theme.add({
  container: {
    flex: 1,
    flexDirection: 'row',
    ios: {
      backgroundColor: 'green',
    },
    android: {
      backgroundColor: 'blue',
    },
  },
});
```

## API

1. **styles** property
Get current styles object, matching with current theme.

2. **name** property
Get current name of activated theme.

3. **add(styles, name = 'default')**
Add styles to a theme. You can add styles many times to a theme as you want!

4. **active(name = 'default')**
Active a theme. Theme data must be added before active.

5. **setRoot(root)**
Set root component for theme. When you active new theme, root component will be rerendered.

6. **css(styles)**
Mixed convert string, array, object to react native compatible styles.

7. **addComponents(components, name = 'default')**
Manage theme components to allow updating content while changing the theme. `components` is an object like `{Container: /*Container Component*/}`

8. **Component**
Get current theme component like `theme.Container` or `import {Container} from 'react-native-theme'`

9. **reset()**
Reset all themes data

## Example

[See this example](https://github.com/apentle/react-native-theme-example)

## react-native-web
This module also works with [react-native-web](https://github.com/necolas/react-native-web) by adding package aliases. For example in `webpack`:
```javascript
// webpack.config.js

module.exports = {
  // ...
  resolve: {
    alias: {
      'react-native/lib/deepDiffer': 'react-native-theme/lib/deepDiffer',
      // ... Other aliases
    }
  }
}
```

Looking for a live web demo? [Go to here.](https://rawgit.com/apentle/react-native-theme-example/master/web/index.html)
