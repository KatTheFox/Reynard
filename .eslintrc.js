// This is the configuration file for ESLint, the TypeScript linter.
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  extends: [
    // The linter base is the shared IsaacScript config.
    // https://github.com/IsaacScript/isaacscript/blob/main/packages/eslint-config-isaacscript/base.js
    "eslint-config-isaacscript/base",
  ],

  parserOptions: {
    // ESLint needs to know about the project's TypeScript settings in order for TypeScript-specific
    // things to lint correctly. We do not point this at "./tsconfig.json" because certain files
    // (such at this file) should be linted but not included in the actual project output.
    project: "./tsconfig.eslint.json",
  },

  // We modify the linting rules from the base for some specific things.
  rules: {
     "no-bitwise": 0, 
     "no-param-reassign": ["error", { props: false }],
     "curly":["error","multi"],
     "n/file-extension-in-import":"off" ,
     "no-void":"off",
     "isaacscript/no-void-return-type":"off",
     "unicorn/prefer-top-level-await":"off",
     "isaacscript/no-mutable-return":"off",
     "isaacscript/prefer-readonly-parameter-types":"off",
     "@typescript-eslint/no-explicit-any":["warn",{ignoreRestArgs:true}]
  },
};
