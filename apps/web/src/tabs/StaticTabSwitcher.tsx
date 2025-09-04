'use client';

import { SettingsTab } from '@/tabs/SettingsTab';
import { AboutTab } from '@/tabs/AboutTab';
import { GuidesTab } from '@/tabs/GuidesTab';

type StaticTabSwitcherProps = {
	tabId: 'settings' | 'guides' | 'about' | null;
	active: boolean;
};

const tabMapper: Record<string, React.FC> = {
	settings: SettingsTab,
	guides: GuidesTab,
	about: AboutTab,
};

/**
 * Helps switch between tabs that do not require
 * persistent state management
 */
export function StaticTabSwitcher({ active, tabId }: StaticTabSwitcherProps) {
	if (!active || tabId === null) return <div />;

	const TabComponent = tabMapper[tabId];
	if (!TabComponent) return <div />;

	return <TabComponent />;
}
