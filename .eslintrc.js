module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
    mocha: true
  },
  extends: [
    'standard'
  ],
  rules: {
    'promise/catch-or-return': 'error'
  }
}
