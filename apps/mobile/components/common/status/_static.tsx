import { Fragment, memo } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusHierarchyParent from './fragments/StatusHierarchyParent';
import StatusHierarchyRoot from './fragments/StatusHierarchyRoot';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Adds a reply indicator to the post
 *
 * NOTE: adjust margin and padding,
 * then the post is boosted and
 * is also a reply
 */
export const ParentPostFragment = memo(function Foo() {
	const { dto } = useAppStatusItem();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
				<StatusHierarchyRoot dto={dto.rootPost} />
			)}
			<StatusHierarchyParent
				dto={dto.replyTo}
				hasParent={!!(dto.rootPost && !IS_PARENT_ALSO_ROOT)}
			/>
		</Fragment>
	);
});
