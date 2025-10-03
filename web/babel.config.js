module.exports = function (api) {
  api.cache(true);

  const isTest = process.env.NODE_ENV === 'test';

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ];

  // Adiciona NativeWind e Reanimated apenas fora dos testes
  if (!isTest) {
    plugins.push('react-native-reanimated/plugin');
  }

  const presets = isTest
    ? ['babel-preset-expo']
    : [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'];

  return {
    presets,
    plugins,
  };
};
