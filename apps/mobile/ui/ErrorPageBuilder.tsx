import { Dimensions, View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import BearError from '#/components/svgs/BearError';
import { useAppTheme } from '#/states/global/hooks';

type ErrorPageBuilderProps = {
	stickerArt?: any;
	errorMessage: string;
	errorDescription: string;
	children?: any;
};

/**
 * Render an error page, with
 * - (optional) sticker art
 * - error message
 * - error description
 * - (component) buttons to try to fix the issue
 * @constructor
 */
function ErrorPageBuilder({
	stickerArt,
	errorMessage,
	errorDescription,
	children,
}: ErrorPageBuilderProps) {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				backgroundColor: theme.background.a0,
				margin: 'auto',
				paddingVertical: 10,
				borderRadius: 12,
				maxWidth: Dimensions.get('window').width * (4 / 5),
			}}
		>
			<View
				style={{
					width: 128,
					height: 196,
					marginHorizontal: 'auto',
				}}
			>
				{stickerArt ? stickerArt : <BearError />}
			</View>
			<View style={{ marginTop: 16, marginHorizontal: 32 }}>
				<AppText.SemiBold
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
					style={{ fontSize: 24, textAlign: 'center' }}
				>
					{errorMessage}
				</AppText.SemiBold>
				<AppText.Normal
					style={{ marginTop: 12, fontSize: 16, textAlign: 'center' }}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					numberOfLines={5}
				>
					{errorDescription}
				</AppText.Normal>
				{children}
			</View>
		</View>
	);
}

export default ErrorPageBuilder;
