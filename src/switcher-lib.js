/*
 * Unit-Testable library for switcher that does not depend on Chrome
 **/

// Utility to allow for replaceAll() since Node (where Jest runs) doesn't
// support replaceAll()
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const getActiveCustomers = (customerData) => {
  const allCustomers = [];
  const sections = ['configure-active', 'configure-internal'];
  for (let i=0; i<sections.length; i++) {
    const section = sections[i];
    for (let c in customerData[section]) {
      if (customerData[section].hasOwnProperty(c)) {
        allCustomers.push(customerData[section][c]);
      }
    }
  }
  return allCustomers;
};

export const makeSubstitutionRegex = (pattern, customer) => {
  const replacements = [
    {from: '{protocol}', to: '\\1'},
    {from: '{shortName}', to: customer.shortName},
    {from: '{fileType}', to: '\\2'},
    {from: '{filename}', to: '\\3'}, // Use actual filename since (e.g. HYD) fileName is wrong in customers.json
    {from: '{customerId}', to: customer.customerId}
  ];
  let regexSubstitution = pattern;
  for (let i=0; i< replacements.length; i++) {
    regexSubstitution = regexSubstitution.replace(new RegExp(escapeRegExp(replacements[i].from), 'g'), replacements[i].to);
  }
  return regexSubstitution
};

export const makeFilterRegex = (customer) => {
  return '^(https):\/\/[^/]+\/.+\/[^\/]+\/customers\/c'+customer.customerId+'\/.+\/assets\/([a-z]+)\/fluidConfigure-([a-z-]+)\\..+$';
};

export const prepareRedirectRules = (pattern, customers) => {
  const rules = [];
  let ruleId = 0;
  for (var i=0; i<customers.length; i++) {
    ruleId++;
    const customer = customers[i];
    const regexFilter = makeFilterRegex(customer);
    const regexSubstitution = makeSubstitutionRegex(pattern, customer);
    rules.push({
      id: ruleId,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: regexSubstitution
        }
      },
      condition: {
        regexFilter: regexFilter
      }
    });
  }
  return rules;
};

