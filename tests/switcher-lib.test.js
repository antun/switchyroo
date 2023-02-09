//const bgScript = require('../src/bg-script.js');


import {jest} from '@jest/globals';
import {
  prepareRedirectRules,
  escapeRegExp,
  sanitizeRules
} from '../src/switcher-lib.js';

test('escapeRegExp', () => {
  expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
});


test('sanitizeRules', () => {
  const dirtyRules = [
    {
      id: 3,
      matched: true,
      replace: 'https://www.example.com/styles.css',
      search: 'https://antunkarlovac.com/includes/styles.css',
      sessionRuleId: 2
    }
  ];
  const cleanRules = [
    {
      id: 3,
      replace: 'https://www.example.com/styles.css',
      search: 'https://antunkarlovac.com/includes/styles.css',
    }
  ];
  expect(sanitizeRules(dirtyRules)).toStrictEqual(cleanRules);
});
