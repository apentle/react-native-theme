# react-native-theme
[![Build Status](https://travis-ci.org/apentle/react-native-theme.svg?branch=master)](https://travis-ci.org/apentle/react-native-theme) [![Coverage Status](https://coveralls.io/repos/github/apentle/react-native-theme/badge.svg?branch=master)](https://coveralls.io/github/apentle/react-native-theme?branch=master)

Theme manager for react native project!

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

theme.add({
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

## API
### styles
Current styles object

### name
Current name of activated theme

### add(styles, name = 'default')
Add styles to a theme

### active(name = 'default')
Active theme

### setRoot(root)
Set root component for theme. When you active new theme, root component will be rerendered.

### css(styles)
Mixed convert string, array, object to react native compatible styles
