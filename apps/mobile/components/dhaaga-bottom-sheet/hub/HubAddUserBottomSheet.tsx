import {
	useAppBottomSheet,
	useAppDb,
	useAppTheme,
} from '#/states/global/hooks';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useEffect, useRef, useState } from 'react';
import { useApiSearchUsers } from '#/hooks/api/useApiSearch';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { ProfileService } from '@dhaaga/db';
import { AppDividerSoft } from '#/ui/Divider';
import BottomSheetMenu from '../components/BottomSheetMenu';
import { useApiGetMyFollowings } from '#/hooks/api/useMy';
import UserSearchResultPresenter from '#/features/hub/presenters/UserSearchResultPresenter';

function HubAddUserBottomSheet() {
	const { theme } = useAppTheme();
	const [SearchQuery, setSearchQuery] = useState(null);
	const [debouncedQuery, setDebouncedQuery] = useState(null);
	const { data } = useApiSearchUsers('followings', debouncedQuery, null);
	const { data: defaultData, error } = useApiGetMyFollowings(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { ctx, stateId } = useAppBottomSheet();
	const [Profile, setProfile] = useState(null);
	const { db } = useAppDb();

	console.log(defaultData, error);
	const TextInputRef = useRef<TextInput>(null);

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
		TextInputRef.current?.focus();
	}

	function onChange() {
		if (ctx.$type !== 'profile-id') return;
		if (ctx.callback) ctx.callback();
	}

	function onClearSearch() {
		setSearchQuery(null);
		setDebouncedQuery(null);
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
				data={debouncedQuery ? (data ?? []) : (defaultData?.data ?? [])}
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
	},
});
