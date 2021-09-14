module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',

  ],
  setupFilesAfterEnv: [
    "./__tests__/setup/nullOrAny.setup.tsx",
    "./__tests__/setup/jestFetchMockEnabled.setup.tsx"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
  ],
  "testPathIgnorePatterns": [
    "./__tests__/setup"
  ],
  // "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
};
