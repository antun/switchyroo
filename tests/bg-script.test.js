//const bgScript = require('../src/bg-script.js');


import {jest} from '@jest/globals';
import {
  prepareRedirectRules,
  getActiveCustomers,
  makeFilterRegex,
  makeSubstitutionRegex,
  escapeRegExp
} from '../src/switcher-lib.js';
const customerJson = require('./customers.json');

const findCustomerById = (id, customers) => {
  const activeCustomers = getActiveCustomers(customers);
  for (let i=0; i<activeCustomers.length; i++) {
    if (Number(activeCustomers[i].customerId) === id) {
      return activeCustomers[i];
    }
  }
};

test('escapeRegExp', () => {
  expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
});

test('Rules Creation', () => {
  const rulesFormat = [
    {
      action: {
        redirect: {
          regexSubstitution: '\\1://localhost/~USER/imp-cog/assets/\\2/fluidConfigure-\\3.\\2'
        },
        type: "redirect"
      },
      condition: {
        regexFilter: '^(https)://[^/]+/.+/[^/]+/customers/c1632/.+/assets/([a-z]+)/fluidConfigure-([a-z-]+)\\..+$'
      },
      id: 1
    },
    {
      action: {
        redirect: {
          regexSubstitution: '\\1://localhost/~USER/imp-ray-ban/assets/\\2/fluidConfigure-\\3.\\2'
        },
        type: "redirect"
      },
      condition: {
        regexFilter: '^(https)://[^/]+/.+/[^/]+/customers/c1628/.+/assets/([a-z]+)/fluidConfigure-([a-z-]+)\\..+$'
      },
      id: 2
    }
  ];
  const customers = [];
  customers.push(findCustomerById(1632, customerJson));
  customers.push(findCustomerById(1628, customerJson));
  expect(prepareRedirectRules('{protocol}://localhost/~USER/imp-{shortName}/assets/{fileType}/fluidConfigure-{filename}.{fileType}', customers)).toStrictEqual(rulesFormat);
});

test('Customers JSON Parsing', () => {
  const activeCustomers = getActiveCustomers(customerJson);
  expect(activeCustomers).toHaveLength(31);
  
});

test('Rules Reliability', () => {
  const urls = [
    {
      customer: 'Ray Ban New',
      id: 1628,
      url: 'https://cdn-prod.fluidconfigure.com/static/assets/prod/prod/customers/c1628/configureHtml/etc/assets/js/fluidConfigure-ray-ban.min.js',
      expectedUrl: 'https://localhost/~USER/imp-ray-ban/assets/js/fluidConfigure-ray-ban.js'
    },
    {
      customer: 'Louis Vuitton',
      id: 1562,
      url: 'https://cdn-prod.fluidconfigure.com/static/assets/prod/prod/customers/c1562/configureHtml/etc/assets/js/fluidConfigure-lou.min.js',
      expectedUrl: 'https://localhost/~USER/imp-lou/assets/js/fluidConfigure-lou.js'

    },
    {
      customer: 'Fender',
      id: 1547,
      url: 'https://configure-published.fluidretail.net/prod/prod/customers/c1547/configureHtml/etc/assets/js/fluidConfigure-fen.min.js',
      expectedUrl: 'https://localhost/~USER/imp-fen/assets/js/fluidConfigure-fen.js'
    }
    
  ];
  for (let i=0; i<urls.length; i++) {
    const customer = urls[i];
    const customerData = findCustomerById(customer.id, customerJson);
    let substitutionRegex = makeSubstitutionRegex('{protocol}://localhost/~USER/imp-{shortName}/assets/{fileType}/fluidConfigure-{filename}.{fileType}', customerData);
    
    substitutionRegex = substitutionRegex.replace(new RegExp(escapeRegExp('\\'), 'g'), '$'); // Groups are $1, $2 in JS
    const filterRegex = makeFilterRegex(customerData);
    const redirectedUrl = customer.url.replace(new RegExp(filterRegex), substitutionRegex);
    expect(redirectedUrl).toBe(customer.expectedUrl);
  }
});
