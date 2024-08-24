import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
	// By default, Docusaurus generates a sidebar from the docs folder structure
	guideSidebar: [
		'guides',
		'guides/installation',
		{
			type: 'category',
			label: 'Development',
			items: [
				{
					type: 'doc',
					id: 'guides/development/using-expo',
				},
				{
					type: 'doc',
					id: 'guides/development/using-custom-expo-devclient',
				},
				{
					type: 'doc',
					id: 'guides/development/using-rn',
				},
			],
		},
		{
			type: 'category',
			label: 'Compilation',
			items: [
				{
					type: 'doc',
					id: 'guides/compiling/using-expo',
				},
				{
					type: 'doc',
					id: 'guides/compiling/using-local',
				},
				{
					type: 'doc',
					id: 'guides/compiling/using-local-lite',
				},
			],
		},
	],
	discoverSidebar: [
		'discover',
		{
			type: 'category',
			label: 'Basic Usage',
			items: [
				{
					type: 'doc',
					id: 'usage/intro',
				},
				{
					type: 'doc',
					id: 'usage/timelines',
				},
				{
					type: 'doc',
					id: 'usage/post-interactions',
				},
				{
					type: 'doc',
					id: 'usage/posting',
				},
				{
					type: 'doc',
					id: 'usage/user-interaction',
				},
			],
		},
		{
			type: 'category',
			label: 'Features',
			items: [
				{
					type: 'doc',
					id: 'discover/better-timelines',
				},
			],
		},
	],
	aboutSidebar: ['about', 'license'],
};

export default sidebars;
