'use client';

import { SettingsTab } from '@/tabs/SettingsTab';
import { AboutTab } from '@/tabs/AboutTab';
import { GuidesTab } from '@/tabs/GuidesTab';
import AuthWorkflow from '../components/auth/AuthWorkflow';
import { useState } from 'react';

const tabMapper: Record<string, React.FC> = {
	settings: SettingsTab,
	guides: GuidesTab,
	about: AboutTab,
};

/**
 * Helps switch between tabs that do not require
 * persistent state management
 */
export function StaticTabSwitcher() {
	const [WorkspaceVisible, setWorkspaceVisible] = useState(false);
	const [DiscoverVisible, setDiscoverVisible] = useState(false);
	const [InboxVisible, setInboxVisible] = useState(false);
	const [ComposerVisible, setComposerVisible] = useState(false);

	return <AuthWorkflow />;
}
