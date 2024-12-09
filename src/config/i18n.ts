/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { initReactI18next, useTranslation } from 'react-i18next';

import { buildI18n, namespaces } from '@graasp/translations';

import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

const i18n = buildI18n().use(initReactI18next);

export const BUILDER_NAMESPACE = 'builder';
i18n.addResourceBundle('ar', BUILDER_NAMESPACE, ar);
i18n.addResourceBundle('de', BUILDER_NAMESPACE, de);
i18n.addResourceBundle('en', BUILDER_NAMESPACE, en);
i18n.addResourceBundle('fr', BUILDER_NAMESPACE, fr);
i18n.addResourceBundle('it', BUILDER_NAMESPACE, it);

export const useBuilderTranslation = () => useTranslation(BUILDER_NAMESPACE);
export const useCommonTranslation = () => useTranslation(namespaces.common);
export const useMessagesTranslation = () => useTranslation(namespaces.messages);
export const useEnumsTranslation = () => useTranslation(namespaces.enums);
export const useChatboxTranslation = () => useTranslation(namespaces.chatbox);

export default i18n;
