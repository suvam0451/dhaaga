import { Fragment, memo, useEffect, useState } from 'react';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { APP_THEME } from '../../../styles/AppTheme';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import * as Haptics from 'expo-haptics';

type Props = {
	isRepost: boolean;
};

/**
 * Show metrics for a post
 *
 * If all metrics are zero, hide the section to preserve
 * vertical screen estate
 * @constructor
 */
const PostStats = memo(function Foo({ isRepost }: Props) {
	const {
		status: post,
		setDataRaw,
		sharedStatus,
	} = useActivitypubStatusContext();
	const { client } = useActivityPubRestClientContext();
	const [RepliesCount, setRepliesCount] = useState(0);
	const [FavouritesCount, setFavouritesCount] = useState(0);
	const [RepostCount, setRepostCount] = useState(0);
	const [IsFavourited, setIsFavourited] = useState(false);
	const [SeparatorDotCount, setSeparatorDotCount] = useState(0);
	const _status = isRepost ? sharedStatus : post;

	useEffect(() => {
		if (!_status) return;
		setRepliesCount(_status?.getRepliesCount());
		setFavouritesCount(_status?.getFavouritesCount());
		setRepostCount(_status?.getRepostsCount());
		setIsFavourited(_status?.getIsFavourited());

		let count = 0;
		if (_status?.getIsFavourited()) count++;
		if (_status?.getRepliesCount() > 0) count++;
		if (_status?.getFavouritesCount() > 0) count++;
		if (_status?.getRepostsCount()) count++;

		setSeparatorDotCount(count);
	}, [_status]);

	function onFavouriteClick() {
		if (IsFavourited) {
			client.unFavourite(_status?.getId()).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		} else {
			client.favourite(_status?.getId()).then((res) => {
				setDataRaw(res);
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			});
		}
	}

	if (RepliesCount < 1 && FavouritesCount < 1 && RepostCount < 1)
		return <View></View>;

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-end',
				marginTop: 12,
			}}
		>
			<View
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
			>
				{FavouritesCount > 0 && (
					<TouchableOpacity
						onPress={onFavouriteClick}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<FontAwesome
							name="star"
							size={18}
							color={IsFavourited ? APP_THEME.LINK : '#ffffff87'}
						/>
						<Text
							style={{
								color: IsFavourited ? APP_THEME.LINK : '#888',
								fontSize: 12,
								marginLeft: 2,
							}}
						>
							{FavouritesCount}
						</Text>
					</TouchableOpacity>
				)}
				<View style={{ flexGrow: 1 }}></View>
				{RepliesCount > 0 && (
					<Fragment>
						<Text
							style={{
								color: '#888',
								marginLeft: 4,
								fontSize: 12,
								textAlign: 'right',
							}}
						>
							{RepliesCount} Replies
						</Text>
						<Text style={{ color: '#888', marginLeft: 2, opacity: 0.3 }}>
							&bull;
						</Text>
					</Fragment>
				)}
				{RepostCount > 0 && (
					<Fragment>
						<Text
							style={{
								color: '#888',
								fontSize: 12,
								marginLeft: 2,
								textAlign: 'right',
							}}
						>
							{RepostCount} Boosts
						</Text>
					</Fragment>
				)}
			</View>
		</View>
	);
});

export default PostStats;
