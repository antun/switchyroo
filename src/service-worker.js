/*
 * Service worker
 */

import {
  prepareRules,
  sanitizeRules
} from './switcher-lib.js';

// This is a debug utility function
// Because background.service_worker.type = 'module', you cannot call this
// manually from the JS console.
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

const updateSessionRules = async (rules) => {
  const processedRules = prepareRules(rules);

  /*
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
  */

  return chrome.declarativeNetRequest.updateSessionRules({
    addRules: processedRules
  });
};

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const defaultSettings = {
  isEnabled: true,
  rules: [
    {
      id: 0,
      type: 'redirect',
      search: 'https://www.example.com/abc',
      replace: 'https://www.example.com/def'
    },
    {
      id: 1,
      type: 'redirect',
      search: 'https://www.example.com/abc',
      replace: 'https://www.example.com/def'
    }
  ]
};

const validateSettingsFormat = (settings) => {
  if (typeof settings === 'undefined') {
    return false;
  }
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
  if (message === 'save-enabled') {
    getSettings().then(async (settings) => {
      settings.isEnabled = arg;
      chrome.storage.local.set({ 'settings': settings }).then(async () => {
        disableAllRules().then(async () => {
          updateIcon();
          if (settings.isEnabled) {
            updateSessionRules(settings.rules).then(async () => {
              sendResponse(settings.isEnabled);
            });
          } else {
            sendResponse(settings.isEnabled);
          }
        });
      });
    });
    return true;
  }
  if (message === 'get-rules') {
    chrome.declarativeNetRequest.getSessionRules().then(sendResponse);
    return true;
  }
  if (message === 'save-rules') {
    getSettings().then(async (settings) => {
      settings.rules = sanitizeRules(arg);
      chrome.storage.local.set({ 'settings': settings }).then(async () => {
        disableAllRules().then(async () => {
          updateSessionRules(settings.rules).then(async () => {
            sendResponse(settings.rules);
          });
        });
      });
    });
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
});

const main = async () => {
  await disableAllRules();
  const settings = await getSettings();
  await updateSessionRules(settings.rules);
  // await writeAllRulesToConsole();
  updateIcon();
};
main();

