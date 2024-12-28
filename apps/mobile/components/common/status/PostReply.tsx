import { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import ExplainOutput from '../explanation/ExplainOutput';
import MediaItem from '../media/MediaItem';
import useMfm from '../../hooks/useMfm';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import ReplyOwner from '../user/ReplyOwner';
import PostReplyToReply from './PostReplyToReply';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';

type PostReplyProps = {
	lookupId: string;
};

function PostReplyContent({ lookupId }: PostReplyProps) {
	const { data, getChildren } = useAppStatusContextDataContext();

	const [ExplanationObject, setExplanationObject] = useState<string | null>(
		null,
	);

	const dto = data.lookup.get(lookupId);
	const children = getChildren(lookupId);

	const { content } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto.content.raw, dto.postedBy.instance],
	});

	const [IsMediaShown, setIsMediaShown] = useState(false);
	const [IsReplyThreadVisible, setIsReplyThreadVisible] = useState(false);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleMediaVisibility() {
		setIsMediaShown(!IsMediaShown);
	}

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const color = useRef(APP_THEME.COLOR_SCHEME_C);
	return (
		<View style={{ marginTop: 8, padding: 8 }}>
			<ReplyOwner dto={dto} />
			{content}
			{ExplanationObject !== null && (
				<ExplainOutput
					additionalInfo={'Translated using OpenAI'}
					fromLang={'jp'}
					toLang={'en'}
					text={ExplanationObject}
				/>
			)}
			{IsMediaShown && (
				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
			)}
			<View
				style={{
					paddingTop: 8,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<View style={{ flexShrink: 1, marginRight: 4 }}>
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
				<View style={{ flexShrink: 1 }}>
					{mediaCount > 0 && (
						<TouchableOpacity
							style={styles.actionButton}
							onPress={toggleMediaVisibility}
						>
							<View style={{ width: 24 }}>
								<FontAwesome6
									name="image"
									size={20}
									color={APP_FONT.MONTSERRAT_BODY}
								/>
							</View>
							{IsMediaShown ? (
								<Text
									style={{ color: APP_FONT.MONTSERRAT_BODY, marginLeft: 4 }}
								>
									Shown ({mediaCount})
								</Text>
							) : (
								<Text
									style={{ color: APP_FONT.MONTSERRAT_BODY, marginLeft: 4 }}
								>
									Hidden ({mediaCount})
								</Text>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
			{/*	Reply Thread*/}
			{IsReplyThreadVisible && (
				<View>
					{children.map((o, i) => (
						<PostReplyToReply
							key={i}
							colors={[color.current]}
							lookupId={o.id}
						/>
					))}
				</View>
			)}
		</View>
	);
}

/**
 * Direct reply to a root level post
 *
 * Must be wrapped with by
 * WithActivitypubStatusContext
 * @constructor
 */
function PostReply({ lookupId }: PostReplyProps) {
	return <PostReplyContent lookupId={lookupId} />;
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
export default PostReply;
