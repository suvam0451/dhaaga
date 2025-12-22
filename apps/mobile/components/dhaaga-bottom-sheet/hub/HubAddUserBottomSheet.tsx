import {
	useAppBottomSheet,
	useAppDb,
	useAppTheme,
} from '#/states/global/hooks';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useEffect, useState } from 'react';
import { useApiSearchUsers } from '#/hooks/api/useApiSearch';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { ProfileService } from '@dhaaga/db';
import { AppDividerSoft } from '#/ui/Divider';
import BottomSheetMenu from '../components/BottomSheetMenu';
import { useApiGetMyFollowings } from '#/hooks/api/useMy';
import UserSearchResultPresenter from '#/features/hub/presenters/UserSearchResultPresenter';
import useAutoFocusBottomSheetInput from '#/ui/hooks/useAutoFocusBottomSheetInput';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';

function HubAddUserBottomSheet() {
	const { theme } = useAppTheme();
	const [SearchQuery, setSearchQuery] = useState(null);
	const [debouncedQuery, setDebouncedQuery] = useState(null);
	const searchResultQuery = useApiSearchUsers(debouncedQuery, null);
	const defaultResultQuery = useApiGetMyFollowings(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { ctx, stateId } = useAppBottomSheet();
	const [Profile, setProfile] = useState(null);
	const { db } = useAppDb();

	const { ref } = useAutoFocusBottomSheetInput(true);

	useEffect(() => {
		if (ctx?.$type !== 'profile-id' || !ctx.profileId) return;
		setProfile(ProfileService.getById(db, ctx.profileId));
	}, [stateId]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(SearchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [SearchQuery]);

	function onSectionPressed() {
		ref.current?.focus();
	}

	function onChange() {
		if (ctx.$type !== 'profile-id') return;
		if (ctx.callback) ctx.callback();
	}

	function onClearSearch() {
		setSearchQuery(null);
		setDebouncedQuery(null);
	}

	const error = searchResultQuery.error ?? defaultResultQuery.error;
	const isRefetching =
		searchResultQuery.isFetching ?? defaultResultQuery.isFetching;
	const isFetched = searchResultQuery.isFetched && defaultResultQuery.isFetched;
	const numItems =
		searchResultQuery.data?.data?.length ??
		defaultResultQuery.data?.data?.length ??
		0;

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<>
			<BottomSheetMenu
				title={'N/A'}
				variant={'raised'}
				CustomHeader={
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}
						onPress={onSectionPressed}
					>
						<AppIcon id={'search'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A40} />
						<TextInput
							ref={ref}
							placeholder={t(`hubAddUserSheet.searchPlaceholder`)}
							placeholderTextColor={theme.secondary.a40}
							numberOfLines={1}
							multiline={false}
							autoCapitalize={'none'}
							value={SearchQuery}
							onChangeText={setSearchQuery}
							style={[
								styles.textInput,
								{
									color: theme.secondary.a20,
								},
							]}
						/>
						<AppIcon
							id={'clear'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
							onPress={onClearSearch}
						/>
					</Pressable>
				}
				style={{ paddingBottom: 8 }}
			/>

			<FlatList
				onLayout={onLayout}
				data={
					debouncedQuery
						? (searchResultQuery.data?.data ?? [])
						: (defaultResultQuery.data?.data ?? [])
				}
				renderItem={({ item }) => (
					<UserSearchResultPresenter
						user={item}
						profile={Profile}
						onChangeCallback={onChange}
					/>
				)}
				contentContainerStyle={{
					backgroundColor: theme.background.a10,
					paddingTop: 16,
					paddingBottom: 50 + 16,
				}}
				keyboardShouldPersistTaps={'always'}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 8 }} />
				)}
				ListEmptyComponent={
					<TimelineStateIndicator
						queryResult={{
							error,
							isRefetching,
							isFetched,
						}}
						numItems={numItems}
						itemType={'user-partial'}
						containerHeight={ContainerHeight}
					/>
				}
			/>
		</>
	);
}

export default HubAddUserBottomSheet;

const styles = StyleSheet.create({
	sheetTitle: {
		fontSize: 28,
		textAlign: 'center',
		marginTop: 48,
		marginBottom: 24,
	},
	sheetDesc: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 8,
		maxWidth: 256,
		alignSelf: 'center',
	},
	textInput: {
		textDecorationLine: 'none',
		fontSize: 16,
		borderRadius: 8,
		fontWeight: 'bold',
		marginLeft: 12,
		flex: 1,
	},
});
