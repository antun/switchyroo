/*
 * Service worker
 */

import {
  prepareRedirectRules,
  getActiveCustomers
} from './switcher-lib.js';

const loadCustomerData = () => {
  return fetch('https://s3.amazonaws.com/fluid-implementations/customers.json')
    .then(response => response.json())
    .catch(err => {
      console.error('Failed to load customers.json', err);
    });
}

// This is a debug utility function
const writeAllRulesToConsole = async () => { // eslint-disable-line no-unused-vars
  return chrome.declarativeNetRequest.getSessionRules().then(result => {
    console.log('bg-script writeAllRulesToConsole', result);
  });
};

const disableAllRules = async () => {
  return chrome.declarativeNetRequest.getSessionRules().then((rules) => {
    const removeRuleIds = rules.map(o => o.id);
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: removeRuleIds
    }).catch(err => {
      console.error('Error trying to remove rules', err);
    });
  });
};

const getCustomerData = async () => {
  return chrome.storage.local.get(['customer-data']).then((result) => {
    const allCustomers = getActiveCustomers(result['customer-data']);
    return allCustomers;
  });
}


const updateRules = async (pattern, stripContentSecurityPolicy) => {
  await getCustomerData().then((allCustomers) => {
    const rules = prepareRedirectRules(pattern, allCustomers);
    let ruleId = rules.length;

    if (stripContentSecurityPolicy) {
      ruleId++;
      rules.push({
        id: ruleId,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            { header: 'content-security-policy', operation: 'remove' }
          ]
        },
        condition: {
          urlFilter: '*', resourceTypes: ['main_frame']
        }
      });
    }

    return chrome.declarativeNetRequest.updateSessionRules({
      addRules: rules
    });
  });
};

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



const defaultSettings = {
  isEnabled: false,
  pattern: '{protocol}://localhost/~antunkarlovac/imp-{shortName}/assets/{fileType}/fluidConfigure-{filename}.{fileType}',
  stripContentSecurityPolicy: true,
  showCurrentRules: false
};

const validateSettingsFormat = (settings) => {
  for (let key in defaultSettings) {
    if (defaultSettings.hasOwnProperty(key)) {
      if (!settings.hasOwnProperty(key) || typeof settings[key] !== typeof defaultSettings[key]) {
        return false;
      }
    }
  }
  return true;
};

const getSettings = async () => {
  return new Promise(resolve => {
    resolve(
      chrome.storage.local.get(['settings']).then((result) => {
        const storedSettings = result.settings;
        if (validateSettingsFormat(storedSettings)) {
          return storedSettings;
        } else {
          console.warn('Settings invalid, restoring from default');
          chrome.storage.local.set({ 'settings': defaultSettings });
          return defaultSettings;
        }
      })
        .catch(err => {
          console.error('Unable to load settings', err);
        })
    );
  });
};

const updateIcon = () => {
  getSettings().then(settings => {
    chrome.action.setIcon({
      path: settings.isEnabled ? 'logo-active-32.png' : 'logo-inactive-32.png'
    });
  });
};

chrome.runtime.onMessage.addListener(({message, arg}, sender, sendResponse) => {
  if (message === 'get-settings') {
    getSettings().then(sendResponse);
    return true;
  }
  if (message === 'save-settings') {
    chrome.storage.local.set({ 'settings': arg }).then(async () => {
      updateIcon();
      disableAllRules().then(async () => {
        if (arg.isEnabled) {
          updateRules(arg.pattern, arg.stripContentSecurityPolicy).then(sendResponse);
        } else {
          sendResponse();
        }
      });
    });
    return true;
  }
  if (message === 'get-rules') {
    chrome.declarativeNetRequest.getSessionRules().then(sendResponse);
    return true;
  }
  if (message === 'get-matched-rules') {
    getCurrentTab().then(tab => {
      chrome.declarativeNetRequest.getSessionRules().then(existingRules => {
        chrome.declarativeNetRequest.getMatchedRules({tabId: tab.id}).then(matchedRules => {
          const response = existingRules.filter(e => {
            let found = false;
            if (matchedRules.rulesMatchedInfo.find(m => m.rule.ruleId === e.id)) {
              found = true;
            }
            return found;
          });
          sendResponse(response);
        })
      });
    });
    return true;
  }
  if (message === 'get-customer-json') {
    getCustomerData().then((allCustomers) => {
      for (var i=0; i<allCustomers.length; i++) {
        const customer = allCustomers[i];
        if (customer.id === arg) {
          sendResponse(customer);
        }
      }
    });
    return true;
  }
});

const main = () => {
  loadCustomerData().then(async response => {
    chrome.storage.local.set({ 'customer-data': response });
    await disableAllRules();
    const settings = await getSettings();
    await updateRules(settings.pattern, settings.stripContentSecurityPolicy);
    // await writeAllRulesToConsole();
    updateIcon();
  });
};
main();

