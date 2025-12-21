import {
	ScrollView,
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
} from 'react-native';
import { useActivitypubTagContext } from '#/states/useTag';
import { useEffect, useState } from 'react';
import InstanceService from '#/services/instance.service';
import { useNavigation } from '@react-navigation/native';
import { APP_THEME } from '#/styles/AppTheme';
import useLongLinkTextCollapse from '#/states/useLongLinkTextCollapse';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';

/**
 * Tag Item, as it appears on a Scrollable timeline-menu
 * @constructor
 */
function TagItemView() {
	const { client } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const subdomain = acct?.server;
	const navigation = useNavigation<any>();

	const { tag, setDataRaw } = useActivitypubTagContext();

	const [AggregatedData, setAggregatedData] = useState(null);

	useEffect(() => {
		if (!tag) return;

		InstanceService.getTagInfoCrossDomain(tag, subdomain)
			.then((res) => {
				setAggregatedData({
					users: res.common.users,
					posts: res.common.posts,
				});
			})
			.catch((e) => {
				console.log('[ERROR]:', e);
			});
	}, [tag]);

	async function onClickFollowTag() {
		if (!tag) return;
		if (tag?.isFollowing()) {
			const data = await client.tags.unfollow(tag.getName());
			setDataRaw(data);
		} else {
			const data = await client.tags.follow(tag.getName());
			setDataRaw(data);
		}
	}

	function onTagClick() {
		navigation.push('Browse Hashtag', { q: tag.getName() });
	}

	const { Result } = useLongLinkTextCollapse(tag.getName(), 64);

	if (!tag || !AggregatedData) return <View />;
	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: '#121212',
				},
			]}
		>
			<TouchableOpacity onPress={onTagClick}>
				<View style={{ flexShrink: 1, maxWidth: 250 }}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						<Text>#{Result}</Text>
					</ScrollView>
					<Text style={{ color: '#fff', opacity: 0.6 }}>
						{AggregatedData.posts} posts from {AggregatedData.users} users
					</Text>
				</View>
			</TouchableOpacity>
			<AppButtonVariantA
				loading={false}
				label={tag?.isFollowing() ? 'Followed' : 'Follow'}
				onClick={onClickFollowTag}
				style={{
					borderColor: APP_THEME.INVALID_ITEM,
					backgroundColor: 'rgba(39, 39, 39, 1)',
				}}
			/>
		</View>
	);
}

export default TagItemView;

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 8,
		paddingHorizontal: 16,
		borderWidth: 1,
		maxWidth: '100%',
		marginBottom: 8,
	},
});
