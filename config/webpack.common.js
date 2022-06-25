const webpack = require('webpack');
const helpers = require('./helpers');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');


const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Sanabel',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};
const config= {
    entry: {
      'polyfills': './clientsrc/polyfills.browser.ts',
      'vendor': './clientsrc/vendor.browser.ts',
      'main': './clientsrc/boot.ts'
    },

    resolve: {
      extensions: ['', '.ts', '.js', '.json', '.scss', '.css'],
      modules: [helpers.root('clientsrc'), 'node_modules'],

    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'string-replace-loader',
          query: {
            search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
            replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
            flags: 'g'
          },
          include: [helpers.root('clientsrc')]
        },

        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: { configFileName: helpers.root('clientsrc', 'tsconfig.json') }
            }, 'angular2-template-loader',
            'angular-router-loader'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        },
        {
          test: /\.css$/,
          use: ['to-string-loader','style-loader' , 'css-loader']
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: 'raw-loader!style-loader!css-loader!sass-loader'
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('clientsrc/index.html')]
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file'
        },
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
            replace: 'var sourceMappingUrl = "";',
            flags: 'g'
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),

      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('clientsrc') // location of your src
      ),

      new CleanWebpackPlugin(
        [
          './wwwroot/dist',
        ]
      ),

      new CopyWebpackPlugin([{
        from: 'clientsrc/assets',
        to: 'assets'
      },{
          from: 'clientsrc/setting',
          to: 'setting'
    },
      {
        from: 'clientsrc/i18n', // copy language  folder
        to: 'i18n'
      }]),

      new HtmlWebpackPlugin({
        template: 'clientsrc/index.html',
        chunksSortMode: 'dependency'
      }),

      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

    ],

  };

module.exports = config;