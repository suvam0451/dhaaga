import { useObject } from '@realm/react';
import { ActivityPubStatus } from '../../../entities/activitypub-status.entity';
import { View, StyleSheet } from 'react-native';
import useMfm from '../../hooks/useMfm';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import {
	OriginalPostedPfpFragment,
	OriginalPosterPostedByFragment,
} from '../../post-fragments/OriginalPoster';
import RealmMediaItem from '../media/RealmMediaItem';

function getAccountDisplayName(
	username: string,
	theirInstance: string,
	myInstance: string,
) {
	if (theirInstance === myInstance) {
		return `@${username}`;
	} else {
		return `@${username}@${theirInstance}`;
	}
}

/**
 * Status Component for posts loaded from memory
 *
 * For posts loaded via API:
 * @see StatusItem
 *
 * The main differences from a normal status are:
 * - may not have boosted by info
 * @constructor
 */
function RealmStatus({ _id }: { _id: Realm.BSON.UUID }) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const post = useObject(ActivityPubStatus, _id);

	const { content } = useMfm({
		content: post.content,
		remoteSubdomain: post.postedBy.server.url,
		emojiMap: new Map<string, EmojiMapValue>(),
		deps: [post._id],
	});

	return (
		<View style={styles.container}>
			<View style={{ display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
				<View style={{ width: 48, height: 48 }}>
					<OriginalPostedPfpFragment
						url={post.postedBy.avatarUrl}
						onClick={() => {}}
					/>
				</View>
				<OriginalPosterPostedByFragment
					onClick={() => {}}
					theirSubdomain={post.postedBy.server.url}
					displayNameRaw={post.postedBy.displayName}
					instanceUrl={getAccountDisplayName(
						post.postedBy.username,
						post.postedBy.server.url,
						primaryAcct.subdomain,
					)}
					postedAt={post.createdAt}
					visibility={post.visibility}
				/>
			</View>
			{content}
			<RealmMediaItem data={post.mediaAttachments} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 4,
		backgroundColor: '#1e1e1e',
		borderRadius: 8,
		padding: 8,
	},
});

export default RealmStatus;
