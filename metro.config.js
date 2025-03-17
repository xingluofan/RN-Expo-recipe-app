// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add any custom config here
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = defaultConfig; 