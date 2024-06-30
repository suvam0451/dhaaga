import { useObject } from '@realm/react';
import { ActivityPubStatus } from '../../../entities/activitypub-status.entity';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import useMfm from '../../hooks/useMfm';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/src/adapters/profile/_interface';
import { Image } from 'expo-image';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import {
	OriginalPostedPfpFragment,
	OriginalPosterPostedByFragment,
	OriginalPosterSkeleton,
} from '../../post-fragments/OriginalPoster';

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
		<View
			style={{
				marginBottom: 16,
				backgroundColor: '#1e1e1e',
				borderRadius: 8,
				padding: 8,
			}}
		>
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
				/>
			</View>
			{content}
		</View>
	);
}

export default RealmStatus;
