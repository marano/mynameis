module.exports = {
  extends: ["standard", "prettier"],
  plugins: ["react", "prettier"],
  env: {},
  globals: {
    Component: true,
    connect: true,
    linkEvent: true
  },
  rules: {
    "react/jsx-uses-vars": 2,
    "prettier/prettier": [
      "error",
      {
        semi: false
      }
    ]
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
}
