import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n, { namespaces } from '@graasp/translations';

const i18n = buildI18n().use(initReactI18next);

export const useBuilderTranslation = (): typeof useTranslation => useTranslation(namespaces.builder);
export const useCommonTranslation = (): typeof useTranslation => useTranslation(namespaces.common);
export const useAccountTranslation = (): typeof useTranslation => useTranslation(namespaces.account);
export const useMessagesTranslation = (): typeof useTranslation => useTranslation(namespaces.messages);
export const useEnumsTranslation = (): typeof useTranslation => useTranslation(namespaces.enums);
export const useCategoriesTranslation = (): typeof useTranslation =>
  useTranslation(namespaces.categories);

export default i18n;
