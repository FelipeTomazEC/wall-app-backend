module.exports = {
    "env": {
        "es2021": true,
        "node": true,
        "jest/globals": true
    },
    "extends": [
        'plugin:import/errors',
        'plugin:import/warnings',
        "airbnb-typescript/base",
        "prettier"
    ],
    "ignorePatterns": [
        '*either.ts',
        '*.sql',
        '*.prisma',
        '*.toml'
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "jest",
        "@typescript-eslint",
    ],
    "settings": {
        'import/resolver': {
          typescript: {},
        },
    },

    "rules": {
        indent: 'off',
        '@typescript-eslint/indent': ['error'],
        'no-constant-condition': ['error'],
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
    }
}
