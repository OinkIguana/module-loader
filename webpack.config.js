module.exports = {
  entry: './src/index.js',
  output: {
      path: './',
      filename: 'index.min.js'
  },
  module: {
      loaders: [
          { test: /\.js$/, exclude: /node_modules|js-modules.*\.js/, loader: 'babel?plugins[]=transform-es2015-modules-commonjs' }
      ]
  },
  resolve: {
    modulesDirectories: [ 'node_modules', 'js-modules' ]
  }
};
