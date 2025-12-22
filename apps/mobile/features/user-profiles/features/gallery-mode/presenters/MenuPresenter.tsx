import { StyleSheet, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { AppText } from '#/components/lib/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import type { PostObjectType } from '@dhaaga/bridge';

type Props = {
	post: PostObjectType;
};

function MenuPresenter({ post }: Props) {
	const { theme } = useAppTheme();

	const INACTIVE_COLOR = theme.secondary.a10;
	return (
		<View
			style={[
				styles.menubar,
				{
					backgroundColor: theme.background.a20,
				},
			]}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<AppIcon id={'heart-outline'} size={24} color={INACTIVE_COLOR} />
				<AppText.Medium
					style={{
						paddingHorizontal: 6,
						fontSize: 16,
					}}
				>
					{post?.stats?.likeCount}
				</AppText.Medium>
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<AppIcon id={'sync-outline'} size={24} color={INACTIVE_COLOR} />
				<AppText.Medium
					style={{
						paddingHorizontal: 6,
						fontSize: 16,
					}}
				>
					{post?.stats?.boostCount}
				</AppText.Medium>
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<AppIcon
					id={'chat-ellipses-outline'}
					size={24}
					color={INACTIVE_COLOR}
				/>
				<AppText.Medium
					style={{
						marginHorizontal: 10,
						fontSize: 16,
					}}
				>
					{post?.stats?.replyCount}
				</AppText.Medium>
			</View>
			<View
				style={{
					width: 2,
					height: '100%',
					backgroundColor: theme.background.a50,
					paddingVertical: 16,
				}}
			/>
			<View style={styles.rightSection}>
				<View style={styles.buttonOnly}>
					<AppIcon id={'share'} size={24} color={theme.secondary.a30} />
				</View>
				<View style={styles.buttonOnly}>
					<Ionicons
						name={'cloud-download-outline'}
						size={24}
						color={theme.secondary.a30}
						style={{ width: 24 }}
					/>
				</View>
			</View>
		</View>
	);
}

export default MenuPresenter;

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

const styles = StyleSheet.create({
	root: {},
	menubar: {
		paddingHorizontal: 8,
		height: 48,
		width: 296,
		zIndex: 99,
		opacity: 0.75,
		borderRadius: 16,
		marginBottom: MARGIN_BOTTOM * 2,
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonOnly: {
		paddingHorizontal: 7,
	},
	rightSection: {
		flexDirection: 'row',
	},
});
