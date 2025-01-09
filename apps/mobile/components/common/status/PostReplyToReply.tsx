import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MutableRefObject, useRef, useState } from 'react';
import useMfm from '../../hooks/useMfm';
import ReplyOwner from '../user/ReplyOwner';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT } from '../../../styles/AppTheme';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';
import { AppThemingUtil } from '../../../utils/theming.util';

type PostReplyToReplyProps = {
	colors: string[];
	lookupId: string;
	depth: number;
};

type PostReplyToReplyContentProps = {
	lookupId: string;
	color: string;
	IsReplyThreadVisible: boolean;
	setIsReplyThreadVisible: any;
};

function PostReplyToReplyContent({
	lookupId,
	color,
	IsReplyThreadVisible,
	setIsReplyThreadVisible,
}: PostReplyToReplyContentProps) {
	const { data } = useAppStatusContextDataContext();

	const dto = data.lookup.get(lookupId);

	const replyCount = dto.stats.replyCount;

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const { content } = useMfm({
		content: dto.content.raw,
		emojiMap: dto.calculated.emojis as any,
	});

	return (
		<View
			style={{
				width: '100%',
				marginTop: 8,
				padding: 8,
				paddingBottom: 8,
			}}
		>
			<ReplyOwner dto={dto} />
			{content}

			{replyCount > 0 && (
				<TouchableOpacity
					style={styles.actionButton}
					onPress={toggleReplyVisibility}
				>
					<View style={{ width: 24 }}>
						{IsReplyThreadVisible ? (
							<FontAwesome6
								name="square-minus"
								size={20}
								color={IsReplyThreadVisible ? color : APP_FONT.MONTSERRAT_BODY}
							/>
						) : (
							<FontAwesome6
								name="plus-square"
								size={20}
								color={IsReplyThreadVisible ? color : APP_FONT.MONTSERRAT_BODY}
							/>
						)}
					</View>
					<View>
						<Text
							style={{
								color: IsReplyThreadVisible ? color : APP_FONT.MONTSERRAT_BODY,
							}}
						>
							{replyCount} replies
						</Text>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
}

function PostReplyToReply({ colors, lookupId, depth }: PostReplyToReplyProps) {
	const { getChildren } = useAppStatusContextDataContext();

	const children = getChildren(lookupId);

	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const depthIndicator = AppThemingUtil.getThreadColorForDepth(depth + 1);

	return (
		<View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					marginVertical: 8,
					marginLeft: 6,
					borderRadius: 8,
				}}
			>
				{colors.map((o, i) => (
					<View
						key={i}
						style={{
							height: '100%',
							width: 2,
							backgroundColor: o,
							marginRight: 4,
						}}
					/>
				))}
				<PostReplyToReplyContent
					color={depthIndicator}
					lookupId={lookupId}
					IsReplyThreadVisible={IsReplyThreadVisible}
					setIsReplyThreadVisible={setIsReplyThreadVisible}
				/>
			</View>
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<PostReplyToReply
							key={i}
							colors={[...colors, depthIndicator]}
							lookupId={o.id}
							depth={1}
						/>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		marginLeft: -8,
		paddingVertical: 6,
		borderRadius: 8,
	},
});

export default PostReplyToReply;
