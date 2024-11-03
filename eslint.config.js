const sufu = require('eslint-config-sufu');

module.exports = [
    ...sufu['ts'],
    {
        files: ['**/*.{ts,mts,cts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json',
                projectService: false
            }
        },
        rules: {
        }
    }
];
