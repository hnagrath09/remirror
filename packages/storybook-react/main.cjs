const path = require('path');
const glob = require('globby');
const isCI = require('is-ci');

const root = path.join(__dirname, '..', '..');

// const babelConfig = require(path.join(root, 'packages', 'storybook-react', '.babelrc.js'));

const stories = glob
  .sync(`packages/storybook-react/stories/**/*.stories.[jt]sx`, {
    ignore: ['**/node_modules'],
    cwd: root,
    absolute: true,
  })
  .filter((file) => file.includes('bold'));

console.log('stories:', stories);

const addons = ['@storybook/addon-controls'];

// Make the introduction the first story.
stories.sort((a, b) => {
  if (a.includes('introduction.stories.tsx')) {
    return -1;
  } else if (b.includes('introduction.stories.tsx')) {
    return 1;
  }

  return 0;
});

const mode = isCI ? 'production' : 'development';
// const dev = process.env.NODE_ENV !== 'production';

async function webpackFinal(config) {
  config.mode = mode;
  // config?.plugins?.push(new DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(mode) } }));

  // config.module?.rules?.push({
  //   test: /\.tsx?$/,
  //   // use: [{ loader: require.resolve('babel-loader'), options: babelConfig }],
  //   exclude: [/node_modules/],
  // });

  const externals = config.externals ?? {};
  const plugins = config.plugins ?? [];
  const resolve = config.resolve ?? {};

  // // Set the ssr helpers for jsdom and domino as externals to the storybook
  // // build.
  // if (Array.isArray(externals)) {
  //   externals.push({ jsdom: 'commonjs jsdom', domino: 'commonjs domino' });
  // } else if (typeof externals === 'object') {
  //   externals.jsdom = 'jsdom';
  //   externals.domino = 'domino';
  // }

  resolve.extensions = resolve.extensions ?? [];
  // resolve.extensions.push('.ts', '.tsx');
  config.resolve = resolve;
  config.plugins = plugins;
  config.externals = externals;

  return config;
}

// const typescript = {
//   check: false,
//   reactDocgen: false,
// };

const config = {
  // addons: ['@storybook/addon-essentials'],
  babel: async (options) => ({
    // Update your babel configuration here
    ...options,
  }),
  addons: ['@storybook/addon-essentials'],
  // features: { storyStoreV7: true },
  framework: '@storybook/react',
  stories: stories,
  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need
    // Return the altered config
    return config;
  },
};

module.exports = config;