## Environment variables

| **Name**                                    | **Default Value**                                         | ** Description **                                                                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **DEVTOOLS_MODULE_FILES_URL**               | `https://gitlab.com/ps-ide/node-boilerplate/blob/develop` | Should contain the base URL where to fetch the source code. Useful to redirect the user to method definitions.                                                                       |
| **DEVTOOLS_MODULE_FILES_TYPE**              | `gitlab`                                                  | Type of files provider.                                                                                                                                                              |
| **DEVTOOLS_MODULE_POSTMAN_KEY**             | `false`                                                   | Postman API key. Used to manage postman collections. You can generate a new one from [here](https://web.postman.co/integrations/services/pm_pro_api)                                 |
| **DEVTOOLS_MODULE_CLEAN_ON_BOOT**           | `'true'`                                                  | Set this environment variable to `'false'` if you want to remove the documentation collection on server startup.                                                                     |
| **DEVTOOLS_MODULE_TRANSLATE_ENGINE**        | `'google'`                                                | Set this environment variable to change the translation engine. Supported engines: `[yandex](https://translate.yandex.com/)`or `[google](https://cloud.google.com/translate/docs/)`. |
| **DEVTOOLS_MODULE_TRANSLATE_KEY**           | `null`                                                    | Contains translation engine key.                                                                                                                                                     |
| **DEVTOOLS_MODULE_TRANSLATE_BASE_LANGUAGE** | `'en'`                                                    | Set this environment variable to change the base language.                                                                                                                           |

## Supported HTTP methods

- [_GET_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)
- [_POST_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
- [_PUT_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)
- [_DELETE_](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)
