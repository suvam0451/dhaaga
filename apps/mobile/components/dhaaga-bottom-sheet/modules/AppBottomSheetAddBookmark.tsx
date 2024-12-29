import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
	useAppBottomSheet_Improved,
	useAppManager,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';
import { useEffect, useState } from 'react';
import { AppPostObject } from '../../../types/app-post.types';
import { PostMiddleware } from '../../../services/middlewares/post.middleware';

type CollectionItemProps = {
	active: boolean;
	activeIconId: APP_ICON_ENUM;
	inactiveIconId: APP_ICON_ENUM;
	activeTint: string;
	inactiveTint: string;
	label: string;
	desc: string[];
	onPress: () => void;
};

/**
 * Row item representing a collection/bookmark
 * set and whether the object belongs in it
 * @param label
 * @param desc
 * @param active
 * @param activeTint
 * @param inactiveTint
 * @param inactiveIconId
 * @param activeIconId
 * @param onPress
 * @constructor
 */
function CollectionItem({
	label,
	desc,
	active,
	activeTint,
	inactiveTint,
	inactiveIconId,
	activeIconId,
	onPress,
}: CollectionItemProps) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				marginBottom: 16,
				alignItems: 'center',
				paddingRight: 4,
			}}
		>
			<View
				style={{
					padding: 16,
					borderWidth: 2,
					borderRadius: 12,
					borderColor: theme.secondary.a50,
				}}
			>
				<AppIcon id={'albums-outline'} size={24} color={theme.secondary.a20} />
			</View>
			<View style={{ marginLeft: 16, justifyContent: 'center' }}>
				<Text
					style={{
						color: theme.secondary.a0,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						fontSize: 18,
					}}
				>
					{label}
				</Text>
				<Text
					style={{
						color: theme.secondary.a20,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						fontSize: 14,
					}}
				>
					{desc.join(' · ')}
				</Text>
			</View>
			<View style={{ flexGrow: 1 }} />
			<Pressable onPress={onPress}>
				{active ? (
					<AppIcon id={activeIconId} size={32} color={activeTint} />
				) : (
					<AppIcon id={inactiveIconId} size={32} color={inactiveTint} />
				)}
			</Pressable>
		</View>
	);
}

function AppBottomSheetAddBookmark() {
	const { theme } = useAppTheme();
	const { ctx } = useAppBottomSheet_Improved();
	const { appManager } = useAppManager();
	const { postPub } = useAppPublishers();
	const [PostObject, setPostObject] = useState<AppPostObject>(
		postPub.readCache(ctx?.uuid),
	);

	function onUpdate({ uuid }: { uuid: string }) {
		setPostObject(postPub.readCache(uuid));
	}

	useEffect(() => {
		setPostObject(appManager.storage.getPostObject());

		postPub.subscribe(ctx?.uuid, onUpdate);
		return () => {
			postPub.unsubscribe(ctx?.uuid, onUpdate);
		};
	}, [ctx]);

	function onToggleBookmark() {
		postPub.toggleBookmark(PostObject.uuid);
	}

	const _target = PostMiddleware.getContentTarget(PostObject);
	const IS_BOOKMARKED = _target.interaction.bookmarked;

	const collection = ['Default', 'Default 2', 'Default 3'];

	const TIP_TEXT_COLOR = theme.secondary.a40;
	return (
		<ScrollView
			style={styles.root}
			contentContainerStyle={{
				paddingTop: 32,
				paddingBottom: 48,
			}}
		>
			<View style={styles.sectionContainer}>
				<Text style={[styles.sectionLabel, { color: theme.secondary.a0 }]}>
					Bookmark
				</Text>
				<CollectionItem
					label={'Bookmark'}
					desc={['Server Feature', 'Synced']}
					activeIconId={'bookmark'}
					inactiveIconId={'bookmark-outline'}
					active={IS_BOOKMARKED}
					activeTint={theme.primary.a0}
					inactiveTint={TIP_TEXT_COLOR}
					onPress={onToggleBookmark}
				/>
			</View>

			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					marginBottom: 20,
				}}
			>
				<Text style={[styles.sectionLabel, { color: theme.secondary.a0 }]}>
					Collections
				</Text>
				<Text
					style={{
						color: theme.complementary.a0,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						fontSize: 16,
					}}
				>
					New collection
				</Text>
			</View>
			{collection.map((collection, i) => (
				<CollectionItem
					key={i}
					label={collection}
					desc={['Local Only', 'Not Synced']}
					activeIconId={'checkmark-circle'}
					inactiveIconId={'add-circle-outline'}
					active={false}
					activeTint={theme.primary.a0}
					inactiveTint={theme.secondary.a30}
					onPress={() => {}}
				/>
			))}
		</ScrollView>
	);
}

export default AppBottomSheetAddBookmark;

const styles = StyleSheet.create({
	root: {
		paddingHorizontal: 16,
		flex: 1,
		marginTop: 12,
	},
	sectionContainer: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 18,
		marginBottom: 16,
	},
	tipText: {
		textAlign: 'center',
		marginBottom: 8,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		maxWidth: 396,
		alignSelf: 'center',
	},
});
