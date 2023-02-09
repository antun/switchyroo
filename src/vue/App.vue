<script setup>
import Header from './components/Header.vue'
import Settings from './components/Settings.vue'
import Rule from './components/Rule.vue'
const version = __APP_VERSION__
</script>

<script>
export default {
  data() {
    return {
      enabled: true,
      rules: [],
      matchedRules: []
    }
  },
  beforeCreate() {
    chrome.runtime.sendMessage({message: 'get-settings'}, async (settings) => {
      chrome.runtime.sendMessage({message: 'get-rules'}, async (sessionRules) => {
        this.enabled = settings.isEnabled;
        const normalizedRules = [];
        for (var i=0; i<settings.rules.length; i++) {
          const settingRule = settings.rules[i];
          const sessionRule = sessionRules.find(r => r.condition.regexFilter === settingRule.search);
          if (sessionRule) {
            settingRule.sessionRuleId = sessionRule.id;
          }
          normalizedRules.push(settingRule);
        }
        this.rules = normalizedRules;
        // No point getting matched rules if this is not enabled
        if (this.enabled) {
          chrome.runtime.sendMessage({message: 'get-matched-rules'}, async (matchedRules) => {
            this.matchedRules = matchedRules;
            this.indicateMatchedRules();
          });
        }
      });
    });
  },
  watch: {
    enabled(oldVal, newVal) {
      console.log('enabled changed', oldVal, newVal);
    },
    rules(oldVal, newVal) {
      console.log('rules changed', oldVal, newVal);
    }
  },
  methods: {
    saveRules() {
      chrome.runtime.sendMessage({message: 'save-rules', arg: this.rules}, async (response) => {
        // Rules saved
      });
    },
    saveEnabled() {
      chrome.runtime.sendMessage({message: 'save-enabled', arg: this.enabled}, async (response) => {
        // Enabled saved
        console.log('enabled saved', response);
      });
    },
    updateEnabled(isEnabled) {
      this.enabled = isEnabled;
      if (!this.enabled) {
        this.clearMatched();
      } else {
        this.indicateMatchedRules();
      }
      this.saveEnabled();
    },
    updateRuleSearch(ruleId, arg) {
      const rule = this.rules.find(rule => rule.id === ruleId);
      rule.search = arg;
      this.saveRules();
    },
    updateRuleReplace(ruleId, arg) {
      const rule = this.rules.find(rule => rule.id === ruleId);
      rule.replace = arg;
      this.saveRules();
    },
    deleteRule(ruleId) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId)
      this.saveRules();
    },
    beginAddRule() {
      const newRuleId = Math.max(...this.rules.map(rule => rule.id)) + 1;
      this.rules.push({
        id: newRuleId,
        type: 'redirect',
        search: 'https://www.example.com/abc',
        replace: 'https://www.example.com/def'
      });
    },
    indicateMatchedRules() {
      for (var i=0; i<this.matchedRules.length; i++) {
        const matchedRule = this.matchedRules[i];
        const rule = this.rules.find(rule => rule.sessionRuleId && rule.sessionRuleId === matchedRule.id);
        rule.matched = true;
      }
    },
    clearMatched() {
      this.rules.forEach(r => {
        r.matched = false;
      });
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <Header v-bind:version="version" />
    </div>
  </header>

  <main>
    <div class="wrapper">
      <Settings v-model:enabled="enabled"
                @enabled-checked="updateEnabled" />
              
      <div class="rulesSection"
           v-bind:class="{ rulesDisabled: !enabled }">
        <div class="rulesContainer">
          <Rule v-for="rule in rules" 
                v-bind:key="rule.id"
                v-bind:id="rule.id"
                v-bind:search="rule.search" 
                v-bind:replace="rule.replace"
                v-bind:matched="rule.matched"
                @update-rule:search="updateRuleSearch"
                @update-rule:replace="updateRuleReplace"
                @delete-rule="deleteRule" />
        </div>
        <div class="addRuleContainer">
          <button @click="beginAddRule">+
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.rulesSection {
  margin-top: 0.24rem;
}

.addRuleContainer {
  margin: 0.34rem;
  padding: 0.18rem;
}

.rulesContainer {
  padding-top: 0.34rem;
}

.rulesDisabled {
  background-color: #eaeaea;
}

</style>
