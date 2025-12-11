import {
	useAppBottomSheet,
	useAppDb,
	useAppTheme,
} from '#/states/global/hooks';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useApiSearchFeeds } from '#/hooks/api/useApiSearch';
import { useEffect, useRef, useState } from 'react';
import { ProfileService } from '@dhaaga/db';
import BskyFeedAddListItemView from '#/components/dhaaga-bottom-sheet/hub/components/BskyFeedAddListItemView';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppDividerSoft } from '#/ui/Divider';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import useApiGetMyFeeds from '#/hooks/api/useFeeds';

function BskyFeedAddSheetPresenter() {
	const { theme } = useAppTheme();
	const [SearchQuery, setSearchQuery] = useState(null);
	const [debouncedQuery, setDebouncedQuery] = useState(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { data } = useApiSearchFeeds(debouncedQuery, null);
	const { data: defaultData } = useApiGetMyFeeds();
	const [Profile, setProfile] = useState(null);
	const { ctx, stateId } = useAppBottomSheet();
	const { db } = useAppDb();

	const TextInputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (ctx.$type !== 'profile-id' || !ctx.profileId) return;
		setProfile(ProfileService.getById(db, ctx.profileId));
	}, [stateId]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(SearchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [SearchQuery]);

	function onChange() {
		if (ctx.$type !== 'profile-id') return;
		if (ctx.callback) ctx.callback();
	}

	function onClearSearch() {
		setSearchQuery(null);
		setDebouncedQuery(null);
	}

	function onSectionPressed() {
		TextInputRef.current?.focus();
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
							ref={TextInputRef}
							placeholder={t(`hubAddFeedSheet.searchPlaceholder`)}
							placeholderTextColor={theme.secondary.a40}
							numberOfLines={1}
							multiline={false}
							autoCapitalize={'none'}
							value={SearchQuery}
							onChangeText={setSearchQuery}
							style={[
								styles.textInput,
								{
									fontFamily: APP_FONTS.ROBOTO_500,
									color: theme.secondary.a20,
									marginLeft: 12,
									flex: 1,
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
				data={debouncedQuery ? (data?.data ?? []) : defaultData}
				renderItem={({ item }) => (
					<BskyFeedAddListItemView
						feed={item}
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
			/>
		</>
	);
}

export default BskyFeedAddSheetPresenter;

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
	},
});
