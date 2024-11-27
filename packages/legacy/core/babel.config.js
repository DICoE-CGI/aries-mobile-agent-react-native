const presets = ['module:metro-react-native-babel-preset']
const plugins = [
  [
    'module-resolver',
    {
      root: ['.'],
      extensions: ['.tsx', 'ts'],
    },
  ],
]
const overrides = [
  {
    plugins: [
      ["@babel/plugin-transform-private-methods", { "loose": true }]
    ]
  }
]

if (process.env['ENV'] === 'prod') {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets,
  plugins,
  overrides,
}
