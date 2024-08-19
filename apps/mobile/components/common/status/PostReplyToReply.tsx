import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MutableRefObject, useRef, useState } from 'react';
import useMfm from '../../hooks/useMfm';
import ReplyOwner from '../user/ReplyOwner';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT } from '../../../styles/AppTheme';
import { Text } from '@rneui/themed';
import StyleService from '../../../services/style.service';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';

type PostReplyToReplyProps = {
	colors: string[];
	lookupId: string;
};

type PostReplyToReplyContentProps = {
	lookupId: string;
	color: MutableRefObject<string>;
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
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto.content.raw, dto.postedBy.instance],
	});

	return (
		<View
			style={{
				marginTop: 8,
				backgroundColor: '#1e1e1e',
				padding: 8,
				paddingBottom: 0,
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
								color={
									IsReplyThreadVisible
										? color.current
										: APP_FONT.MONTSERRAT_BODY
								}
							/>
						) : (
							<FontAwesome6
								name="plus-square"
								size={20}
								color={
									IsReplyThreadVisible
										? color.current
										: APP_FONT.MONTSERRAT_BODY
								}
							/>
						)}
					</View>
					<View>
						<Text
							style={{
								color: IsReplyThreadVisible
									? color.current
									: APP_FONT.MONTSERRAT_BODY,
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

function PostReplyToReply({ colors, lookupId }: PostReplyToReplyProps) {
	const { data, getChildren } = useAppStatusContextDataContext();

	const dto = data.lookup.get(lookupId);
	const children = getChildren(lookupId);

	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const color = useRef(StyleService.generateRandomColorHex());

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
						style={{ height: '100%', width: 2, backgroundColor: o }}
					></View>
				))}
				<PostReplyToReplyContent
					color={color}
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
							colors={[color.current]}
							lookupId={dto.id}
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
