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
    }
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
        console.log('App.vue, rules saved', response);
      });
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
      <Settings v-model:enabled="enabled" />
      <hr />
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
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
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
