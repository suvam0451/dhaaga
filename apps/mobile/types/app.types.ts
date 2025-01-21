/**
 * The list of supported
 * menu actions for the
 * FAB menu
 */
export enum FAB_MENU_MODULES {
	NAVIGATOR,
	OPEN_SIDEBAR,
	CREATE_POST,
	TIMELINE_SWITCHER,
}

export enum APP_SETTINGS {
	// timelines
	TIMELINE_SENSITIVE_CONTENT = 'timeline/sensitive-content',
	TIMELINE_CONTENT_WARNING = 'timeline/content-warning',
}

export type AppResultPageType<T> = {
	items: T[];
	/**
	 * Some drivers don't support null
	 * and must be converted to undefined
	 */
	maxId: string | null /**
	 * Some drivers don't support null
	 * and must be converted to undefined
	 */;
	minId: string | null;
	success: boolean;
};

export const pageResultDefault = {
	success: false,
	maxId: null,
	minId: null,
	items: [],
};

export enum LOCALIZATION_NAMESPACE {
	CORE = 'core',
	GUIDES = 'guides',
	GLOSSARY = 'glossary',
	SHEETS = 'sheets',
	DIALOGS = 'dialogs',
}

/**
 * Everything is parsed for "textContent"
 * hashtags and links are not parsed for
 * "displayName"
 */
export type TEXT_PARSING_VARIANT = 'bodyContent' | 'displayName';
