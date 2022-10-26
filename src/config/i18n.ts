/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n, { namespaces } from '@graasp/translations';

const i18n = buildI18n().use(initReactI18next);

export const useBuilderTranslation = () => useTranslation(namespaces.builder);
export const useCommonTranslation = () => useTranslation(namespaces.common);
export const useAccountTranslation = () => useTranslation(namespaces.account);
export const useMessagesTranslation = () => useTranslation(namespaces.messages);
export const useEnumsTranslation = () => useTranslation(namespaces.enums);
export const useCategoriesTranslation = () =>
  useTranslation(namespaces.categories);

export default i18n;
