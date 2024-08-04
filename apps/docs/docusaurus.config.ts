import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
	title: 'Dhaaga',
	tagline: 'Put the fun back in Fediverse',
	favicon: 'img/favicon.ico',

	// Set the production url of your site here
	url: 'https://your-docusaurus-site.example.com',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/docs',
	// baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'suvam0451', // Usually your GitHub org/user name.
	projectName: 'dhaaga', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					routeBasePath: '/',
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					// editUrl:
					// 	'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			title: 'Dhaaga',
			logo: {
				alt: 'My Site Logo',
				src: 'img/logo.svg',
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'discoverSidebar',
					position: 'left',
					label: 'Discover',
				},
				{
					type: 'docSidebar',
					sidebarId: 'guideSidebar',
					position: 'left',
					label: 'Guides',
				},
				{ to: '/blog', label: 'Blog', position: 'left' },
				{
					href: 'https://github.com/suvam0451/dhaaga',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Tutorial',
							to: '/docs/discover',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Discord',
							href: 'https://discord.gg/kMp5JA9jwD',
						},
						{
							label: 'Matrix',
							href: 'https://matrix.to/#/#server0451:matrix.org',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Blog',
							to: '/blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/facebook/docusaurus',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Debashish Patra`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
