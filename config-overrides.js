module.exports = function override(config) {
  // Drop noisy tslint plugin
  const EXCLUDED_PLUGINS = ['ForkTsCheckerWebpackPlugin'];
  // eslint-disable-next-line no-param-reassign
  config.plugins = config.plugins.filter(
    (plugin) => !EXCLUDED_PLUGINS.includes(plugin.constructor.name),
  );

  return config;
};
