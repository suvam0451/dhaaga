import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import APP_ICON_ENUM from '../components/lib/Icon';
import { APP_ROUTING_ENUM } from '../utils/route-list';
import { ActivityPubService } from '@dhaaga/bridge';
import type { TFunction } from 'i18next';
import { LOCALIZATION_NAMESPACE } from '../types/app.types';

export enum APP_PINNED_OBJECT_TYPE {
	/**
	 * ActivityPub - SNS - Inherited
	 */
	AP_PROTO_MICROBLOG_HOME = 'apProto_microBlog_HOME',
	AP_PROTO_MICROBLOG_LOCAL = 'apProto_microBlog_LOCAL',
	AP_PROTO_MICROBLOG_SOCIAL = 'apProto_microBlog_SOCIAL',
	AP_PROTO_MICROBLOG_BUBBLE = 'apProto_microBlog_BUBBLE',
	AP_PROTO_MICROBLOG_GLOBAL = 'apProto_microBlog_GLOBAL',

	AP_PROTO_MICROBLOG_USER_LOCAL = 'apProto_microBlog_USER_Local',
	AP_PROTO_MICROBLOG_USER_REMOTE = 'apProto_microBlog_USER_Remote',

	AP_PROTO_MICROBLOG_TAG_LOCAL = 'apProto_microBlog_TAG_Local',
	AP_PROTO_MICROBLOG_TAG_REMOTE = 'apProto_microBlog_TAG_Remote',

	/**
	 * AT Protocol
	 */
	AT_PROTO_MICROBLOG_HOME = 'atProto_microBlog_HOME', // Following
	AT_PROTO_MICROBLOG_DISCOVER = 'atProto_microBlog_DISCOVER', // Discover
	AT_PROTO_MICROBLOG_FEED = 'apProto_microBlog_FEED', // Any feed with uri
}

export enum SEARCH_RESULT_TAB {
	TOP = 'top',
	LATEST = 'latest',
	FEEDS = 'feeds',
	POSTS = 'posts',
	PEOPLE = 'people',
	TAGS = 'tags',
	LINKS = 'links',
	NEWS = 'news',
	HOME = 'home',
}

export type AppModulesProps = {
	label: string;
	desc: string;
	iconId: APP_ICON_ENUM;
	to: APP_ROUTING_ENUM;
};

class DriverService {
	/**
	 * ActivityPub handle to webfinger
	 * lookup compatible object
	 * @param handle handle resolved by app
	 * @param server home server
	 */
	static splitHandle(handle: string, server: string) {
		if (!handle)
			return {
				username: null,
				host: null,
				handle: null,
			};
		const splits = handle.split('@');
		if (splits.length === 3) {
			return {
				username: splits[1],
				host: server === splits[2] ? null : splits[1],
				handle,
			};
		} else if (splits.length === 2) {
			return {
				username: splits[1],
				host: null,
				handle,
			};
		}
	}
	static getAccountModules(
		t: TFunction<LOCALIZATION_NAMESPACE.CORE[], undefined>,
		driver: KNOWN_SOFTWARE,
	): AppModulesProps[] {
		if (ActivityPubService.blueskyLike(driver)) {
			return [
				{
					label: t(`profile.appFeatures.feeds.label`),
					desc: t(`profile.appFeatures.feeds.desc`),
					iconId: 'edit',
					to: APP_ROUTING_ENUM.MY_FEEDS,
				},
				{
					label: t(`profile.appFeatures.likes.label`),
					desc: t(`profile.appFeatures.likes.desc`),
					iconId: 'heart',
					to: APP_ROUTING_ENUM.MY_LIKES,
				},
				{
					label: t(`profile.appFeatures.lists.label`),
					desc: t(`profile.appFeatures.lists.desc`),
					iconId: 'list',
					to: APP_ROUTING_ENUM.MY_LISTS,
				},
			];
		} else if (ActivityPubService.misskeyLike(driver)) {
			return [
				{
					label: t(`profile.appFeatures.bookmarks.label`),
					desc: t(`profile.appFeatures.bookmarks.desc`),
					iconId: 'bookmark',
					to: APP_ROUTING_ENUM.MY_BOOKMARKS,
				},
				{
					label: t(`profile.appFeatures.lists.label`),
					desc: t(`profile.appFeatures.lists.desc`),
					iconId: 'language',
					to: APP_ROUTING_ENUM.MY_LISTS,
				},
			];
		} else if (ActivityPubService.mastodonLike(driver)) {
			return [
				{
					label: t(`profile.appFeatures.likes.label`),
					desc: t(`profile.appFeatures.likes.desc`),
					iconId: 'heart',
					to: APP_ROUTING_ENUM.MY_LIKES,
				},
				{
					label: t(`profile.appFeatures.bookmarks.label`),
					desc: t(`profile.appFeatures.bookmarks.desc`),
					iconId: 'bookmark',
					to: APP_ROUTING_ENUM.MY_BOOKMARKS,
				},
				{
					label: t(`profile.appFeatures.lists.label`),
					desc: t(`profile.appFeatures.lists.desc`),
					iconId: 'list',
					to: APP_ROUTING_ENUM.MY_LISTS,
				},
			];
		} else {
			return [];
		}
	}
}

export default DriverService;
