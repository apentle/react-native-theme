'use strict';

import { StyleSheet } from 'react-native';

jest.unmock('../index');
const theme = require('../index');

// Testing Data
const theme_default_obj = {
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
  },
  img: {
    width: 100,
    height: 45,
  },
};
const theme_default_ex_obj = {
  img: {
    width: 100,
  },
  alt: {
    fontSize: 20,
  },
}
const theme_red_obj = {
  header: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    color: 'red',
  },
};
const theme_red_extend_obj = {
  title: {
    backgroundColor: '#F5FCFF',
  },
  content: {
    color: 'red',
  },
};
const theme_default = StyleSheet.create(theme_default_obj);
const theme_red = StyleSheet.create(theme_red_obj);
const theme_red_extend = StyleSheet.create(theme_red_extend_obj);

describe('theme', () => {
  it('theme.add(styles, name): add/merge theme', () => {
    theme.add({});
    expect(theme.styles).toEqual({});
    theme.add(theme_default);
    expect(theme.styles.container).toBe(theme_default.container);
    expect(theme.styles.title).toBe(theme_default.title);
    theme.add(theme_default_ex_obj);
    expect(theme.styles.img).toBe(theme_default.img);

    theme.add(theme_red, 'red');
    theme.add(theme_red_extend, 'red');
    expect(theme.styles.container).toBe(theme_default.container);
  });

  it('theme.active(name): active theme', () => {
    theme.active('doesnotexist');
    expect(theme.styles).toEqual(theme_default);

    theme.active('red');
    expect(theme.styles.container).toBe(theme_default.container);
    expect(theme.styles.header).toBe(theme_red.header);
    expect(theme.styles.content).toBe(theme_red_extend.content);
    expect(theme.styles.title).toBe(theme_red.title);
    expect(theme.styles.title).toBeGreaterThan(theme_red_extend.title);

    theme.add(theme_default_obj, 'obj');
    theme.active('obj');
    expect(typeof theme.styles.container).toBe('number');
    expect(theme.styles.container).toBeGreaterThan(theme_default.container);

    theme.add(theme_default_ex_obj, 'obj');
    expect(theme.styles.img).toBeGreaterThan(theme_default.img);
    expect(theme.styles.alt).toBeGreaterThan(theme.styles.img);
  });

  it('theme.setRoot(root): set root component for theme', () => {
    const forceUpdate = jest.fn();
    theme.setRoot({forceUpdate});
    theme.active('obj');
    expect(forceUpdate.mock.calls.length).toBe(0);
    
    theme.active();
    expect(forceUpdate).toBeCalled();
    
    theme.setRoot();
    theme.active('red');
    expect(forceUpdate.mock.calls.length).toBe(1);
  });

  it('theme.styles: styles property of theme manager', () => {
    theme.active();
    expect(theme.styles).toEqual(theme_default);
  });

  it('theme.css(styles): get css flatten styles', () => {
    expect(0).toEqual(1);
  });
});
