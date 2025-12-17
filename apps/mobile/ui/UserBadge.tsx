import {
	TouchableOpacity,
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';
import Avatar from '#/ui/Avatar';
import TextAstRendererView from '#/ui/TextAstRendererView';
import {
	type AppParsedTextNodes,
	DriverService,
	RandomUtil,
} from '@dhaaga/bridge';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';

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

	return (
		<View style={[styles.root, style]}>
			<Avatar uri={avatarUrl} onPressed={onAvatarPressed} />
			<TouchableOpacity
				onPress={onDisplayNamePressed}
				style={styles.displayNameArea}
				delayPressIn={200}
			>
				{USE_DISPLAY_NAME ? (
					<NativeTextMedium numberOfLines={1}>{displayName}</NativeTextMedium>
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
