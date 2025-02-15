import { ProfilePinnedTimeline } from '../database/_schema';
import { APP_PINNED_OBJECT_TYPE } from './driver.service';
import { TimelineFetchMode } from '../states/interactors/post-timeline.reducer';
import { APP_ICON_ENUM } from '../components/lib/Icon';
import { TFunction } from 'i18next';
import { LOCALIZATION_NAMESPACE } from '../types/app.types';

export class HubService {
	static resolveTimelineDestinations(
		t: TFunction<LOCALIZATION_NAMESPACE.CORE[], undefined>,
		items: ProfilePinnedTimeline[],
	): {
		pinId: number;
		label: string;
		destination: TimelineFetchMode;
		iconId: APP_ICON_ENUM;
		server: string;
		avatar?: string;
	}[] {
		return items
			.map((item) => {
				switch (item.category) {
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_GLOBAL: {
						return {
							pinId: item.id,
							label: t(`hub.feeds.global`),
							destination: TimelineFetchMode.FEDERATED,
							iconId: 'globe' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_LOCAL: {
						return {
							pinId: item.id,
							label: t(`hub.feeds.local`),
							destination: TimelineFetchMode.LOCAL,
							iconId: 'people' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AT_PROTO_MICROBLOG_HOME:
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_HOME: {
						return {
							pinId: item.id,
							label: t(`hub.feeds.home`),
							destination: TimelineFetchMode.HOME,
							iconId: 'home' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_SOCIAL: {
						return {
							pinId: item.id,
							label: t(`hub.feeds.social`),
							destination: TimelineFetchMode.SOCIAL,
							iconId: 'musical-notes-outline' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_BUBBLE: {
						return {
							pinId: item.id,
							label: t(`hub.feeds.bubble`),
							destination: TimelineFetchMode.SOCIAL,
							iconId: 'create' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AT_PROTO_MICROBLOG_FEED: {
						return {
							pinId: item.id,
							label: item.displayName,
							destination: TimelineFetchMode.FEED,
							iconId: 'create' as APP_ICON_ENUM,
							avatar: item.avatarUrl,
							server: item.server,
						};
					}
					default: {
						return null;
					}
				}
			})
			.filter((o) => !!o);
	}
}
