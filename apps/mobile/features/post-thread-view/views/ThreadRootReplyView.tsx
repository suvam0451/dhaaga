import { useState } from 'react';
import { View } from 'react-native';
import ReplyToReplyItemPresenter from './ReplyToReplyItemPresenter';
import { usePostThreadState } from '@dhaaga/react';
import ReplyContentView from '#/features/post-thread-view/views/ReplyContentView';

type PostReplyProps = {
	postId: string;
};

function Content({ postId }: PostReplyProps) {
	const data = usePostThreadState();
	const [IsThreadShown, setIsThreadShown] = useState(false);

	const dto = data.lookup.get(postId);
	const children = (data.children.get(postId) ?? []).map((childId) =>
		data.lookup.get(childId),
	);

	return (
		<View style={{ marginHorizontal: 10, overflow: 'visible' }}>
			<ReplyContentView
				post={dto}
				setIsReplyThreadVisible={setIsThreadShown}
				IsThreadShown={IsThreadShown}
			/>
			{/*	Reply Thread*/}
			{IsThreadShown && (
				<>
					{children.map((o, i) => (
						<ReplyToReplyItemPresenter key={i} postId={o.id} depth={1} />
					))}
				</>
			)}
		</View>
	);
}

function ReplyItem({ postId }: PostReplyProps) {
	return <Content postId={postId} />;
}

export default ReplyItem;
