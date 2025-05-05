module.exports = {
  env: {
    browser: true, // for React (frontend)
    node: true, // Enable Node.js global variables
    es2021: true, // Use modern ECMAScript features
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12, // or latest version (2021 or later)
    sourceType: 'module', // Use 'script' if you are using CommonJS (e.g., require)
  },
  rules: {
    // Add any custom rules if needed
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the version of React
    },
  },
};
