const SCOPE = 'devtools';

module.exports = (config) => {
  const { env } = config.utils;
  const { publicAddress } = config.app;
  return {
    devtools: {
      repository: {
        link: env.get('FILES_URL', SCOPE) || `${publicAddress}/api/v1/devtools/files/open`,
        type: env.get('FILES_TYPE', SCOPE),
      },
      postman: {
        key: env.get('POSTMAN_KEY', SCOPE),
      },
      cleanOnBoot: env.get('CLEAN_ON_BOOT', SCOPE),
      addExcluded: env.get('DOC_ADD_EXCLUDED', SCOPE),
      translate: {
        key: env.get('TRANSLATE_KEY', SCOPE),
        engine: env.get('TRANSLATE_ENGINE', SCOPE),
        from: env.get('TRANSLATE_BASE_LANGUAGE', SCOPE),
      },
      addIamToGuest: env.get('ADD_IAM_TO_GUEST', SCOPE),
      displayEnvVars: env.get('DISPLAY_VARIABLE', SCOPE),
      npm: {
        registry: env.get('NPM_REGISTRY', SCOPE),
        username: env.get('NPM_USERNAME', SCOPE),
        password: env.get('NPM_PASSWORD', SCOPE),
        dryRun: env.get('NPM_DRY_RUN', SCOPE),
      },
    },
  };
};
