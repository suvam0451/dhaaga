import { useAppTheme } from '#/states/global/hooks';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { useState } from 'react';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type ReplyControlPresenterProps = {
	count: number;
};

function PostCommentThreadControls({ count }: ReplyControlPresenterProps) {
	const [AllExpanded, setAllExpanded] = useState(false);
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				flexDirection: 'row',
				paddingHorizontal: 16,
				backgroundColor: theme.background.a40,
				paddingVertical: 10,
				marginBottom: 16,
				borderRadius: 16,
			}}
		>
			<View style={{ flex: 1 }}>
				<AppText.SemiBold
					style={{
						color: theme.secondary.a20,
						fontSize: 18,
					}}
				>
					{`${count} Replies`}
				</AppText.SemiBold>
			</View>
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity style={{ paddingHorizontal: 8 }}>
					<AppIcon
						id={'funnel-outline'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={{ paddingLeft: 8 }}>
					<AppIcon
						id={
							AllExpanded
								? 'chevron-collapse-outline'
								: 'chevron-expand-outline'
						}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default PostCommentThreadControls;
