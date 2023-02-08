//const bgScript = require('../src/bg-script.js');


import {jest} from '@jest/globals';
import {
  prepareRedirectRules,
  escapeRegExp
} from '../src/switcher-lib.js';

test('escapeRegExp', () => {
  expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
});


