import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n, { namespaces } from '@graasp/translations';

const i18n = buildI18n().use(initReactI18next);

export const useBuilderTranslation = () => useTranslation(namespaces.builder);

export default i18n;
