import { Profile, ProfileService } from '@dhaaga/db';
import { FlatList, View } from 'react-native';
import AddNewProfile from './AddNewProfile';
import {
	useActiveUserSession,
	useAppDb,
	useAppDialog,
	useAppTheme,
} from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import CollectionItem from '../../collections/components/CollectionItem';
import { Fragment } from 'react';
import { useProfileListFeedAssignment } from '#/features/hub/api/useProfileQuery';
import { useProfileMutation } from '#/features/hub/api/useProfileMutation';
import useApiGetFeedDetails from '#/features/timelines/features/controller/interactors/useApiGetFeedDetails';
import { AppDividerSoft } from '#/ui/Divider';

type Props = {
	uri: string;
	Header?: any;
	Footer?: any;
};

/**
 * Component that helps with assigning feed
 * items onto hub profiles
 *
 * Feed -> Hub
 *
 * Also allows creation of new profiles
 * @param data
 * @param Header
 * @param Footer
 * @constructor
 */
function HubToFeedAllocatorView({ uri, Header, Footer }: Props) {
	const { data, refetch } = useProfileListFeedAssignment(uri);
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { show } = useAppDialog();
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	const { toggleFeedPin } = useProfileMutation();
	const { data: feedData } = useApiGetFeedDetails(uri);

	function onPressAddNew() {
		show(
			{
				title: t(`hub.profileAdd.title`),
				actions: [],
				description: t(`hub.profileAdd.description`, {
					returnObjects: true,
				}) as string[],
			},
			{ $type: 'text-prompt', placeholder: t(`hub.profileAdd.placeholder`) },
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				if (!ctx.userInput) return;
				ProfileService.addProfile(db, acct, ctx.userInput.trim());
				refetch();
			},
		);
	}

	function onToggle(profile: Profile) {
		if (!feedData) return;
		toggleFeedPin
			.mutateAsync({
				feed: feedData.feed,
				profile,
			})
			.finally(() => {
				refetch();
			});
	}

	return (
		<FlatList
			style={{ flex: 1 }}
			data={data}
			renderItem={({ item }) => (
				<View style={{ paddingLeft: 16, paddingRight: 8 }}>
					<CollectionItem
						active={item.has}
						activeIconId={'checkmark-circle'}
						inactiveIconId={'add-circle-outline'}
						activeTint={theme.primary}
						inactiveTint={theme.secondary.a30}
						label={item.name}
						desc={t(`collections.fallbackDesc`)}
						onPress={() => {
							onToggle(item);
						}}
					/>
				</View>
			)}
			ItemSeparatorComponent={() => (
				<AppDividerSoft style={{ marginVertical: 8 }} />
			)}
			ListHeaderComponent={
				<Fragment>
					{Header && Header}
					<AddNewProfile
						onPressAddNew={onPressAddNew}
						sectionLabel={'Pin to Hub'}
						actionButtonLabel={'Add Profile'}
					/>
				</Fragment>
			}
			ListFooterComponent={<Fragment>{Footer && Footer}</Fragment>}
		/>
	);
}

export default HubToFeedAllocatorView;
