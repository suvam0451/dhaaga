import {
	TouchableOpacity,
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
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

type Props = {
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
	onDisplayNamePressed?: () => void;
};

function UserBadge({
	avatarUrl,
	displayName,
	parsedDisplayName,
	handle,
	emojiMap,
	style,
	onAvatarPressed,
	onDisplayNamePressed,
}: Props) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();

	const USE_DISPLAY_NAME =
		!parsedDisplayName || DriverService.supportsAtProto(driver);

	const handleFallback = displayName === '' ? handle : displayName;
	return (
		<View style={[styles.root, style]}>
			<ThemedMainAuthor uri={avatarUrl} onPress={onAvatarPressed} />
			<TouchableOpacity
				onPress={onDisplayNamePressed}
				style={styles.displayNameArea}
				delayPressIn={200}
			>
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
			</TouchableOpacity>
		</View>
	);
}

export default UserBadge;

const styles = StyleSheet.create({
	root: { flexDirection: 'row', flex: 1 },
	displayNameArea: { paddingLeft: 8, flex: 1 },
});
