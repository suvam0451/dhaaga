import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import useMfm from '../../hooks/useMfm';
import ReplyOwner from '../user/ReplyOwner';
import { useAppStatusContextDataContext } from '../../../hooks/api/statuses/WithAppStatusContextData';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../../utils/theming.util';
import { appDimensions } from '../../../styles/dimensions';
import { APP_FONTS } from '../../../styles/AppFonts';
import { ToggleReplyVisibility } from './DetailView/_shared';

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

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

function PostReplyToReplyContent({
	lookupId,
	IsReplyThreadVisible,
	setIsReplyThreadVisible,
}: PostReplyToReplyContentProps) {
	const { data } = useAppStatusContextDataContext();

	const dto = data.lookup.get(lookupId);

	const replyCount = dto.stats.replyCount;
	const mediaCount = dto.content.media.length;

	function toggleReplyVisibility() {
		setIsReplyThreadVisible(!IsReplyThreadVisible);
	}

	const { content } = useMfm({
		content: dto.content.raw,
		emojiMap: dto.calculated.emojis as any,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	return (
		<View
			style={{
				width: '100%',
				paddingTop: 8,
				paddingHorizontal: 8,
			}}
		>
			<ReplyOwner dto={dto} />
			{/* Some magical numbers to get rid of overflow */}
			<View style={{ width: '84%', marginBottom: SECTION_MARGIN_BOTTOM }}>
				{content}
			</View>
			<ToggleReplyVisibility
				enabled={replyCount > 0}
				onPress={toggleReplyVisibility}
				expanded={IsReplyThreadVisible}
				count={replyCount}
				style={{ marginRight: 4 }}
			/>
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
