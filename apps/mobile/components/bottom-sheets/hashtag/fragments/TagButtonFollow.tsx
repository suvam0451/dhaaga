import { memo } from 'react';
import { Button } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Text, View } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useActivitypubTagContext } from '../../../../states/useTag';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const TagButtonFollow = memo(() => {
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
		})),
	);
	const { tag, setDataRaw } = useActivitypubTagContext();
	const isFollowing = tag?.isFollowing();

	async function onClickFollowTag() {
		if (!tag) return;
		if (tag?.isFollowing()) {
			const { data } = await client.tags.unfollow(tag.getName());
			if (driver === KNOWN_SOFTWARE.MASTODON) {
				setDataRaw(data);
			} else {
				console.log(data);
			}
		} else {
			const { data } = await client.tags.follow(tag.getName());
			if (driver === KNOWN_SOFTWARE.MASTODON) {
				setDataRaw(data);
			} else {
				console.log(data);
			}
		}
	}

	/** Not supported */
	if (driver !== KNOWN_SOFTWARE.MASTODON) return <View />;

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
