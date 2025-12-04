import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useActivitypubTagContext } from '../../../states/useTag';
import { useEffect, useMemo, useState } from 'react';
import InstanceService from '../../../services/instance.service';
import { useNavigation } from '@react-navigation/native';
import { APP_THEME } from '../../../styles/AppTheme';
import useLongLinkTextCollapse from '../../../states/useLongLinkTextCollapse';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppButtonVariantA } from '#/components/lib/Buttons';

/**
 * Tag Item, as it appears on a Scrollable timeline-menu
 * @constructor
 */
function TagItem() {
	const { acct, router } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			router: o.router,
		})),
	);
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
			const data = await router.tags.unfollow(tag.getName());
			setDataRaw(data);
		} else {
			const data = await router.tags.follow(tag.getName());
			setDataRaw(data);
		}
	}

	function onTagClick() {
		navigation.push('Browse Hashtag', { q: tag.getName() });
	}

	const { Result } = useLongLinkTextCollapse(tag.getName(), 64);

	return useMemo(() => {
		if (!tag || !AggregatedData) return <View />;
		return (
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 8,
					paddingHorizontal: 16,
					backgroundColor: '#121212',
					borderWidth: 1,
					maxWidth: '100%',
					marginBottom: 8,
				}}
			>
				<TouchableOpacity onPress={onTagClick}>
					<View style={{ flexShrink: 1, maxWidth: 250 }}>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						>
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
	}, [tag, AggregatedData]);
}

export default TagItem;
