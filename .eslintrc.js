module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'no-console': ['warn'],
        'no-extra-parens': ['warn'],
        'no-promise-executor-return': ['error'],
        'no-template-curly-in-string': ['error'],
        'array-callback-return': ['error'],
        'eqeqeq': ['error'],
        'no-invalid-this': ['warn'],
        'camelcase': ['error'],
        'func-call-spacing': ['error', 'never'],
        'indent': ['error', 4],
        'key-spacing': ['error', { 'afterColon': true }],
        'no-var': ['error'],
        'prefer-spread': ['warn'],
        'prefer-destructuring': ['warn'],
        'prefer-template': ['warn']
    }
};