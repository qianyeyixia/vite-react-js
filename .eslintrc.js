module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
  ],
  plugins: ["jsx-a11y", "import", "react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  env: {
    "browser": true,
    "node": true,
    "es6": true
  },
  parserOptions: {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
