const { fileURLToPath } = require('url');
const { dirname } = require('path');

module.exports = {
    moduleFileExtensions: ['js', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': '@vue/vue3-jest',
    },
    transformIgnorePatterns: ['/node_modules/'],
    testEnvironment: 'jsdom',
};