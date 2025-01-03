import { Fragment, memo } from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import ParentPost from './fragments/ParentPost';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

/**
 * Adds a reply indicator to the post
 *
 * NOTE: adjust margin and padding,
 * then the post is boosted and
 * is also a reply
 */
export const ParentPostFragment = memo(function Foo() {
	const { dto } = useAppStatusItem();
	const { theme } = useAppTheme();

	if (!dto.replyTo)
		return (
			<View
				style={{
					borderRadius: 8,
					borderBottomLeftRadius: 0,
					borderBottomRightRadius: 0,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: 6,
						paddingHorizontal: 12,
					}}
				>
					<Ionicons
						color={theme.complementaryA.a0}
						name={'arrow-redo-outline'}
						size={14}
					/>
					<Text
						style={{
							color: theme.textColor.medium,
							marginLeft: 4,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 13,
						}}
					>
						Replied to a thread
					</Text>
				</View>
			</View>
		);

	const IS_PARENT_ALSO_ROOT = dto.rootPost?.id === dto.replyTo?.id;
	return (
		<Fragment>
			{dto.rootPost && !IS_PARENT_ALSO_ROOT && (
				<ParentPost dto={dto.rootPost} />
			)}
			<ParentPost dto={dto.replyTo} />
		</Fragment>
	);
});
