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

Set the root, otherwise this react-native-theme won't have a tree to render from and you won't get any updates from calling theme.active()
```javascript
componentWillMount() {
    // You don't need to put it here, but this is how I did it in my parent React.Component, as I had styles based on
    // themes throughout my application. If you have styles only in one area, you will have improved performance
    // by setting the root there (though the performance may not be noticable for many applications).
    theme.setRoot(this)
  }
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
```javascript
console.log(theme.styles.title.color)
```

2. **name** property
Get current name of activated theme.
```javascript
if (theme.name == 'red') {
  theme.active() // sets the default theme and all under the root is rerendered
} else {
 theme.active('red')
}
```

3. **add(styles, name = 'default')**
Add styles to a theme. You can add styles many times to a theme as you want!
```javascript
theme.add({
  title: {
    color:'red',
    fontSize:24
  }
}, 'red')
```

4. **active(name = 'default')**
Active a theme. Theme data must be added before active.
```javascript
<Button title="Press Me" onPress={()=>{
  theme.active('red')
}} />
```

5. **setRoot(root)**
Set root component for theme. When you active new theme, root component will be rerendered.
```javascript
componentWillMount() {
  theme.setRoot(this)
}
```

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
This module also works with [react-native-web](https://github.com/necolas/react-native-web). You used to need to add package aliases, but not anymore. Just an extension. For example in `webpack`:
```javascript
// webpack.config.js

module.exports = {
  // ...
  resolve: {
    extensions: [ '.web.js', '.js' ],
  }
}
```

Looking for a live web demo? [Go to here.](https://rawgit.com/apentle/react-native-theme-example/master/web/index.html)
