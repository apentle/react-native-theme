'use strict';

jest.unmock('../layout');
const layout = require('../layout');

describe('layout', () => {
  it('check global function _createRNElement', () => {
    expect(_createRNElement).toBeDefined();
    var oldFn = _createRNElement;
    require('../layout');
    expect(_createRNElement).toBe(oldFn);
  });

  it('modify exist layout', () => {
    // Must be show warning
    layout(1);
    // Add modify functions
    layout({
      global: function(o) {
        if (o.config && o.config.style === 3) {
          o.children.push('Title');
        }
        if (o.config && o.config.layoutKey === 'container_content') {
          o.children.push(this.content + ' Global');
        } else if (o.config !== null) {
          expect(this).toBeUndefined();
        } else {
          expect(this).toBeNull();
        }
      },
      container_header: function(o) {
        o.children.push('Header');
      },
      container: {
        header: function(o) {
          o.children.push('Header');
        },
        content: function(o) {
          o.children.push(this.content);
        },
        empty: function(o) {
          o.stopRender = true;
        },
        invalid: 1,
        footer: function(o) {
          o.element = _createRNElement('Text', null, 'New Footer');
        }
      }
    });
    var elements = _createRNElement('View', {layoutKey: 'container', style: 1},
      _createRNElement('Text', {layoutKey: 'container_header', style: 2}, 'Header'),
      _createRNElement('Text', {layoutKey: 'container_title', style: 3}),
      _createRNElement('Text', {layoutKey: 'container_content', layoutContext: {content: 'News'}}, 'Content'),
      _createRNElement('Text', {layoutKey: 'container_empty'}, 'Empty'),
      _createRNElement('Text', null),
      _createRNElement('Text'),
      _createRNElement('Text', {layoutKey: 'container_footer'}, 'Footer')
    );
    expect(elements).toEqual({
      type: 'View',
      props: {style: 1},
      children: [
        {
          type: 'Text',
          props: {style: 2},
          children: ['Header', 'Header', 'Header']
        },
        {
          type: 'Text',
          props: {style: 3},
          children: 'Title'
        },
        {
          type: 'Text',
          props: {},
          children: ['Content', 'News Global', 'News']
        },
        null,
        {
          type: 'Text',
          props: null
        },
        {
          type: 'Text',
          props: undefined
        },
        {
          type: 'Text',
          props: null,
          children: 'New Footer'
        }
      ]
    });
    layout.reset();
  });
});
