angular.module('implementationswitcher', [])
  .controller('RulesController', ['$scope', function($scope) {
    chrome.runtime.sendMessage({message: 'get-settings'}, (response) => {
      $scope.$apply(() => { // Needed to force redraw of Angular code:
        $scope.settings = response;
      });
    });
    chrome.runtime.sendMessage({message: 'get-rules'}, async (response) => {
      $scope.$apply(() => { // Needed to force redraw of Angular code:
        $scope.rules = response;
      });
    });
    chrome.runtime.sendMessage({message: 'get-matched-rules'}, async (response) => {
      $scope.$apply(() => { // Needed to force redraw of Angular code:
        $scope.matchedRules = response;
        $scope.matchedRuleIds = response.map(o => o.id);
        const customerIds = response.map(o => {
          try {
            const regexFilter = o.condition.regexFilter;
            const regex = /c([0-9]+)/;
            const customerId = regexFilter.match(regex)[1];
            return Number(customerId);
          } catch (e) {
            console.warn('Could not extract customerId from regex', e);
          }
        });
        if (customerIds.length > 0) {
          chrome.runtime.sendMessage({message: 'get-customer-json', arg: customerIds[0]}, async (customerJson) => {
            let jsonText = '';
            try {
              jsonText = JSON.stringify(customerJson, null, 2);
            } catch (e) {
              console.warn('Could not serialize JSON', customerJson);
            }
            $scope.customerJson = jsonText;
          });
        }
      });
    });


    $scope.saveSettings = function() {
      if (typeof $scope.settings !== 'undefined') {
        chrome.runtime.sendMessage({message: 'save-settings', arg: $scope.settings}, async () => {
          chrome.runtime.sendMessage({message: 'get-rules'}, async (response) => {
            $scope.$apply(() => {
              $scope.rules = response;
            });
          });
        });
      }
    };

    $scope.$watch('settings', function(newValue, oldValue){ // eslint-disable-line no-unused-vars
      $scope.saveSettings();
      if (typeof newValue !== 'undefined') {
        localStorage['settings'] = JSON.stringify(newValue);
      }
    }, true);
  }]);
