<script setup>
import Header from './components/Header.vue'
import Settings from './components/Settings.vue'
import Rule from './components/Rule.vue'
</script>

<script>
export default {
  data() {
    return {
      enabled: true,
      rules: []
    }
  },
  beforeCreate() {
    chrome.runtime.sendMessage({message: 'get-settings'}, async (settings) => {
      this.enabled = settings.isEnabled;
      this.rules = settings.rules;
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
      console.log('updateEnabled()', isEnabled);
      this.enabled = isEnabled;
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
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <Header />
    </div>
  </header>

  <main>
    <div class="wrapper">
      <Settings v-model:enabled="enabled"
                @enabled-checked="updateEnabled" />
              
      <hr />
      <div class="rulesSection"
           v-bind:class="{ rulesDisabled: !enabled }">
        <div class="rulesContainer">
          <Rule v-for="rule in rules" 
                v-bind:key="rule.id"
                v-bind:id="rule.id"
                v-bind:search="rule.search" 
                v-bind:replace="rule.replace"
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

.rulesDisabled {
  background-color: #eaeaea;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }


  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}
</style>
