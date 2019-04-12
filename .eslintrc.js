module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true
  },
  extends: [
    'standard'
  ],
  rules: {
    'promise/catch-or-return': 'error'
  }
}
