import {
	TouchableOpacity,
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
	Pressable,
} from 'react-native';
import TextAstRendererView from '#/ui/TextAstRendererView';
import {
	type AppParsedTextNodes,
	DriverService,
	RandomUtil,
} from '@dhaaga/bridge';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';
import ThemedMainAuthor from '#/features/skins/components/ThemedMainAuthor';
import { Link } from 'expo-router';

type Props = {
	userId: string;
	avatarUrl: string;
	/**
	 * optional. will be replaced by
	 * username if not provided
	 */
	displayName: string | null;
	/**
	 * Saved posts may not have the parsed
	 * context
	 */
	parsedDisplayName?: AppParsedTextNodes;
	handle: string;
	emojiMap?: Map<string, string>;
	style?: StyleProp<ViewStyle>;

	onAvatarPressed?: () => void;
};

function UserBadge({
	userId,
	avatarUrl,
	displayName,
	parsedDisplayName,
	handle,
	emojiMap,
	style,
	onAvatarPressed,
}: Props) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();

	const USE_DISPLAY_NAME =
		!parsedDisplayName || DriverService.supportsAtProto(driver);

	const handleFallback = displayName === '' ? handle : displayName;
	return (
		<View style={[styles.root, style]}>
			<ThemedMainAuthor uri={avatarUrl} onPress={onAvatarPressed} />
			<Link href={`/user/${userId}`} asChild style={styles.displayNameArea}>
				<Pressable>
					{USE_DISPLAY_NAME ? (
						<NativeTextMedium numberOfLines={1}>
							{handleFallback}
						</NativeTextMedium>
					) : (
						<TextAstRendererView
							tree={
								parsedDisplayName.length === 0
									? [{ uuid: RandomUtil.nanoId(), type: 'para', nodes: [] }]
									: parsedDisplayName
							}
							variant={'displayName'}
							mentions={[]}
							emojiMap={emojiMap}
							oneLine
						/>
					)}
					<NativeTextNormal
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
						}}
						numberOfLines={1}
					>
						{handle}
					</NativeTextNormal>
				</Pressable>
			</Link>
		</View>
	);
}

export default UserBadge;

const styles = StyleSheet.create({
	root: { flexDirection: 'row', flex: 1 },
	displayNameArea: { paddingLeft: 8, flex: 1, flexDirection: 'column' },
});
