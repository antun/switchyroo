/*
 * Unit-Testable library for switcher that does not depend on Chrome
 **/

// Utility to allow for replaceAll() since Node (where Jest runs) doesn't
// support replaceAll()
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const prepareRedirectRule = (search, replace) => {
  return {
    id: null,
    action: {
      type: 'redirect',
      redirect: {
        regexSubstitution: replace
      }
    },
    condition: {
      regexFilter: search
    }
  };
};

export const prepareRules = (rules) => {
  const preparedRules = [];
  let ruleId = 0;
  for (var i=0; i<rules.length; i++) {
    ruleId++;
    const rule = rules[i];
    let preparedRule;
    if (rule.type === 'redirect') {
      preparedRule = prepareRedirectRule(rule.search, rule.replace);
    }
    preparedRule.id = ruleId;
    preparedRules.push(preparedRule);
  }
  return preparedRules;
};
