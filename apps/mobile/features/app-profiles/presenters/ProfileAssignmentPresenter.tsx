import { Profile } from '@dhaaga/db';
import { FlatList, View } from 'react-native';
import AssignmentListControlView from '../../_shared/views/AssignmentListControlView';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import CollectionItem from '../../collections/components/CollectionItem';
import { Fragment } from 'react';

type ProfileHas = Profile & { has: boolean };
type Props = {
	data: ProfileHas[];
	onToggle: (profile: Profile) => void;
	onAddNewProfile: () => void;
	Header?: JSX.Element;
	Footer?: JSX.Element;
};

/**
 * Presents and allows editing inclusion/exclusion
 * of any information block into profiles for this
 * account.
 *
 * Also allows creation of new profiles
 * @param data
 * @param onToggle
 * @param onAddNewProfile
 * @param Header
 * @param Footer
 * @constructor
 */
function ProfileAssignmentPresenter({
	data,
	onToggle,
	onAddNewProfile,
	Header,
	Footer,
}: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

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
						activeTint={theme.primary.a0}
						inactiveTint={theme.secondary.a30}
						label={item.name}
						desc={t(`collections.fallbackDesc`)}
						onPress={() => {
							onToggle(item);
						}}
					/>
				</View>
			)}
			ListHeaderComponent={
				<Fragment>
					{Header && Header}
					<AssignmentListControlView
						onPressAddNew={onAddNewProfile}
						sectionLabel={'Pin to Profile'}
						actionButtonLabel={'Add Profile'}
					/>
				</Fragment>
			}
			ListFooterComponent={<Fragment>{Footer && Footer}</Fragment>}
		/>
	);
}

export default ProfileAssignmentPresenter;
