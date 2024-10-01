const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      vm: require.resolve('vm-browserify'),
      process: require.resolve('process/browser'),  
      assert: require.resolve('assert/'),          
      url: require.resolve('url/')                  
    },
    extensions: ['.ts', '.js', '.jsx', '.json']  
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',   
      Buffer: ['buffer', 'Buffer']
    }),
  ]);

  return config;
};