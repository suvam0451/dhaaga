// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
// en
import enCore from './locales/en/core.json';
import enGuides from './locales/en/guides.json';
import enGlossary from './locales/en/glossary.json';
import enSheets from './locales/en/sheets.json';
import enDialogs from './locales/en/dialogs.json';
import enSettings from './locales/en/settings.json';
// jp
import jpCore from './locales/jp/core.json';
import jpGuides from './locales/jp/guides.json';
import jpGlossary from './locales/jp/glossary.json';
import jpDialogs from './locales/jp/dialogs.json';
import jpSheets from './locales/jp/sheets.json';
import jpSettings from './locales/jp/settings.json';
// de
import deCore from './locales/de/core.json';
import deGuides from './locales/de/guides.json';
import deDialogs from './locales/de/dialogs.json';
import deSheets from './locales/de/sheets.json';
import deGlossary from './locales/de/glossary.json';
import deSettings from './locales/de/settings.json';
// id
import idCore from './locales/id/core.json';
import idDialogs from './locales/id/dialogs.json';
import idGlossary from './locales/id/glossary.json';
import idGuides from './locales/id/guides.json';
import idSheets from './locales/id/sheets.json';
import idSettings from './locales/id/settings.json';

const resources = {
	en: {
		core: enCore,
		dialogs: enDialogs,
		glossary: enGlossary,
		guides: enGuides,
		sheets: enSheets,
		settings: enSettings,
	},
	id: {
		core: idCore,
		dialogs: idDialogs,
		glossary: idGlossary,
		guides: idGuides,
		sheets: idSheets,
		settings: idSettings,
	},
	jp: {
		core: jpCore,
		dialogs: jpDialogs,
		glossary: jpGlossary,
		guides: jpGuides,
		sheets: jpSheets,
		settings: jpSettings,
	},
	de: {
		core: deCore,
		dialogs: deDialogs,
		guides: deGuides,
		glossary: deGlossary,
		sheets: deSheets,
		settings: deSettings,
	},
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
