module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './__tests__/mocks/nativeModules.ts',
    './__tests__/mocks/async-storage.ts'
  ],
  setupFilesAfterEnv: [
    "./__tests__/setup/nullOrAny.setup.tsx",
    "./__tests__/setup/jestFetchMockEnabled.setup.tsx"
  ],

  /* THIS IS NEEDED TO RUN TESTS */
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json', // as specified by ts-jest
      babelConfig: true,
    },
  },
  //transformIgnorePatterns: [],
  /* END - THIS IS NEEDED TO RUN TESTS */

  /* OLD SETTING BEFORE ABOVE CODE */
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?@react-native|react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
  ],
/* END - OLD SETTING BEFORE ABOVE CODE */


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


