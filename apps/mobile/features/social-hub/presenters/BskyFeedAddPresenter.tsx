import {
	useAppBottomSheet,
	useAppDb,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { useApiSearchFeeds } from '../../../hooks/api/useApiSearch';
import { useEffect, useRef, useState } from 'react';
import { ProfileService } from '@dhaaga/db';
import FeedSearchResultPresenter from './FeedSearchResultPresenter';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { APP_FONTS } from '../../../styles/AppFonts';

function BskyFeedAddSheetPresenter() {
	const { theme } = useAppTheme();
	const [SearchQuery, setSearchQuery] = useState(null);
	const [debouncedQuery, setDebouncedQuery] = useState(null);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);
	const { data } = useApiSearchFeeds(debouncedQuery, null);
	const [Profile, setProfile] = useState(null);
	const { ctx } = useAppBottomSheet();
	const { db } = useAppDb();

	const TextInputRef = useRef<TextInput>(null);

	useEffect(() => {
		try {
			setProfile(ProfileService.getById(db, parseInt(ctx?.profileId)));
		} catch (e) {
			console.log('e', e);
		}
	}, [ctx]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(SearchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [SearchQuery]);

	function onChange() {
		if (ctx?.onChange) {
			ctx.onChange();
		}
	}

	function onClearSearch() {
		setSearchQuery(null);
		setDebouncedQuery(null);
	}

	function onSectionPressed() {
		TextInputRef.current?.focus();
	}

	return (
		<View
			style={{
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				paddingTop: 16,
				backgroundColor: theme.background.a30,
			}}
		>
			<Pressable
				style={{
					paddingHorizontal: 20,
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: 16,
				}}
				onPress={onSectionPressed}
			>
				<View>
					<AppIcon id={'search'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A40} />
				</View>
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
				<View>
					<AppIcon
						id={'clear'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
						onPress={onClearSearch}
					/>
				</View>
			</Pressable>
			<FlatList
				data={data.data}
				renderItem={({ item }) => (
					<FeedSearchResultPresenter
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
			/>
		</View>
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
