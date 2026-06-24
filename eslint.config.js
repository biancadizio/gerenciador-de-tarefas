const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // You can add custom rules or ignore paths here
    ignores: ['dist/*', '.expo/*'],
  },
]);