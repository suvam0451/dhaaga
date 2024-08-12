import { memo } from 'react';
import { Button } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useActivitypubTagContext } from '../../../../states/useTag';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';

const TagButtonFollow = memo(() => {
	const { client, domain } = useActivityPubRestClientContext();
	const { tag, setDataRaw } = useActivitypubTagContext();
	const isFollowing = tag?.isFollowing();

	async function onClickFollowTag() {
		if (!tag) return;
		if (tag?.isFollowing()) {
			const { data, error } = await client.tags.unfollow(tag.getName());
			if (domain === KNOWN_SOFTWARE.MASTODON) {
				setDataRaw(data);
			} else {
				console.log(data);
			}
		} else {
			const { data, error } = await client.tags.follow(tag.getName());
			if (domain === KNOWN_SOFTWARE.MASTODON) {
				setDataRaw(data);
			} else {
				console.log(data);
			}
		}
	}

	/** Not supported */
	if (domain !== KNOWN_SOFTWARE.MASTODON) return <View />;

	if (isFollowing) {
		return (
			<Button
				onPress={onClickFollowTag}
				type="outline"
				buttonStyle={{
					borderColor: '#cb6483',
					backgroundColor: 'rgba(39, 39, 39, 1)',
				}}
				titleStyle={{
					color: APP_FONT.MONTSERRAT_HEADER,
				}}
			>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: '#cb6483',
						opacity: 0.87,
					}}
				>
					Followed
				</Text>
			</Button>
		);
	}
	return (
		<Button
			buttonStyle={{
				borderColor: 'red',
				backgroundColor: '#cb6483',
			}}
			onPress={onClickFollowTag}
		>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				Follow
			</Text>
		</Button>
	);
});

export default TagButtonFollow;
