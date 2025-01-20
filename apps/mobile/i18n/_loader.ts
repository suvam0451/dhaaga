// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import enCore from './locales/en/core.json';
import enGuides from './locales/en/guides.json';
import enGlossary from './locales/en/glossary.json';
import jpCore from './locales/jp/core.json';
import jpGuides from './locales/jp/guides.json';
import jpGlossary from './locales/jp/glossary.json';

const resources = {
	en: { core: enCore, guides: enGuides, glossary: enGlossary },
	jp: { core: jpCore, guides: jpGuides, glossary: jpGlossary },
};

const initI18n = async () => {
	const savedLanguage = Localization.getLocales()[0].languageCode;

	i18n.use(initReactI18next).init({
		compatibilityJSON: 'v4',
		resources,
		lng: savedLanguage,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	});
};

initI18n();

export default i18n;
