import { ProfilePinnedTimeline } from '../database/_schema';
import { APP_PINNED_OBJECT_TYPE } from './driver.service';
import { TimelineFetchMode } from '../states/reducers/post-timeline.reducer';
import { APP_ICON_ENUM } from '../components/lib/Icon';

export class HubService {
	static resolveTimelineDestinations(items: ProfilePinnedTimeline[]): {
		pinId: number;
		label: string;
		destination: TimelineFetchMode;
		iconId: APP_ICON_ENUM;
		server: string;
	}[] {
		return items
			.map((item) => {
				switch (item.category) {
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_GLOBAL: {
						return {
							pinId: item.id,
							label: 'Global',
							destination: TimelineFetchMode.FEDERATED,
							iconId: 'globe' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_LOCAL: {
						return {
							pinId: item.id,
							label: 'Local',
							destination: TimelineFetchMode.LOCAL,
							iconId: 'people' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_HOME: {
						return {
							pinId: item.id,
							label: 'Home',
							destination: TimelineFetchMode.HOME,
							iconId: 'home' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_SOCIAL: {
						return {
							pinId: item.id,
							label: 'Social',
							destination: TimelineFetchMode.SOCIAL,
							iconId: 'musical-notes-outline' as APP_ICON_ENUM,
							server: item.server,
						};
					}
					case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_BUBBLE: {
						return {
							pinId: item.id,
							label: 'Bubble',
							destination: TimelineFetchMode.SOCIAL,
							iconId: 'create' as APP_ICON_ENUM,
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
