import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	ScrollView,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../libs/redux/store";
import { AccountState } from "../../../libs/redux/slices/account";
import {
	ActivityPubAccount,
	ActivityPubClientFactory,
	ActivityPubStatuses,
	MastodonRestClient,
	MisskeyRestClient,
	UnknownRestClient,
} from "@dhaaga/shared-abstraction-activitypub/src";
import { useQuery } from "@tanstack/react-query";
import { adaptUserProfile } from "../../../utils/activitypub-adapters";
import { Image } from "expo-image";
import { Dimensions } from "react-native";
import {
	AvatarContainerWithInset,
	AvatarExpoImage,
} from "../../../styles/Containers";
import { PrimaryText, SecondaryText } from "../../../styles/Typography";
import { Text } from "@rneui/themed";
import StatusFragment from "../../timelines/fragments/StatusFragment";
import { TabView, SceneMap } from "react-native-tab-view";
import UserPostsProvider, { UserPostsHook } from "../../../contexts/UserPosts";
import Ionicons from "@expo/vector-icons/Ionicons";

const FirstRoute = () => {
	const { store } = UserPostsHook();
	const posts = useRef([]);

	useEffect(() => {
		// console.log("inventory changed", store.posts)
		posts.current = store.posts;
	}, [store]);

	return (
		<View>
			{posts.current &&
				posts.current.map((o, i) => <StatusFragment key={i} status={o} />)}
		</View>
	);
};

const SecondRoute = () => (
	<View style={{ flex: 1 }}>
		<Text style={{ color: "white" }}>Kukkad</Text>
	</View>
);

const renderScene = SceneMap({
	first: FirstRoute,
	second: SecondRoute,
});

type UserProfileBrowsePostsProps = {
	userId: string;
};

/**
 * Component to allow users to view images and posts of a user
 * @param param0
 * @returns
 */
function UserProfileBrowsePosts({ userId }: UserProfileBrowsePostsProps) {
	const { store, dispatch } = UserPostsHook();

	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: "first", title: "First" },
		{ key: "second", title: "Second" },
	]);

	const [RecentPostsCollapsed, setRecentPostsCollapsed] = useState(true);

	const accountState = useSelector<RootState, AccountState>((o) => o.account);
	const restClient = useRef<
		MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
	>(null);

	useEffect(() => {
		if (!accountState.activeAccount) {
			restClient.current = null;
			console.log("have not selected any account");
			return;
		}

		const token = accountState.credentials.find(
			(o) => o.credential_type === "access_token"
		)?.credential_value;
		if (!token) {
			restClient.current = null;
			console.log("token not found");
			return;
		}

		const client = ActivityPubClientFactory.get(
			accountState.activeAccount.domain as any,
			{
				instance: accountState.activeAccount.subdomain,
				token,
			}
		);
		restClient.current = client;
	}, [accountState]);

	async function queryFnPosts() {
		console.log("fetching posts for userId", userId);
		const res = await restClient.current.getUserPosts(userId);
		console.log("number of posts fetched", res?.length);
		return res;
	}

	// Post Queries
	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubStatuses>({
			queryKey: ["profile/posts", restClient.current, userId],
			queryFn: queryFnPosts,
			enabled: userId !== undefined,
		});

	useEffect(() => {
		// console.log(status)
		if (status === "success") {
			// console.log("posts fetched", data);
			dispatch.setPosts(data);
		}
	}, [status, data]);

	return (
		<View>
			<View
				style={{
					margin: 6,
					paddingTop: 8,
					paddingBottom: 8,
					paddingLeft: 16,
					paddingRight: 16,
					backgroundColor: "#222",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "white", flexGrow: 1 }}>Images</Text>
				<Ionicons name="chevron-forward" size={24} color="white" />
			</View>
			<TouchableOpacity
				onPress={() => {
					setRecentPostsCollapsed(!RecentPostsCollapsed);
				}}
			>
				<View
					style={{
						margin: 6,
						paddingTop: 8,
						paddingBottom: 8,
						paddingLeft: 16,
						paddingRight: 16,
						backgroundColor: "#222",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text style={{ color: "white", flexGrow: 1 }}>Recent Posts</Text>
					<Ionicons
						name={RecentPostsCollapsed ? "chevron-forward" : "chevron-down"}
						size={24}
						color="white"
					/>
				</View>
			</TouchableOpacity>
			<View style={{ display: RecentPostsCollapsed ? "none" : "flex" }}>
				<FirstRoute />
			</View>
		</View>
	);
}

function UserProfile({ route, navigation }) {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);
	const q = route?.params?.id;
	const restClient = useRef<
		MastodonRestClient | MisskeyRestClient | UnknownRestClient | null
	>(null);

	useEffect(() => {
		if (!accountState.activeAccount) {
			restClient.current = null;
			console.log("have not selected any account");
			return;
		}

		const token = accountState.credentials.find(
			(o) => o.credential_type === "access_token"
		)?.credential_value;
		if (!token) {
			restClient.current = null;
			console.log("token not found");
			return;
		}

		const client = ActivityPubClientFactory.get(
			accountState.activeAccount.domain as any,
			{
				instance: accountState.activeAccount.subdomain,
				token,
			}
		);
		restClient.current = client;
	}, [accountState]);

	function queryFn() {
		const username = route?.params?.id;
		const res = restClient.current.getUserProfile(username);
		return res;
	}

	// Queries
	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubAccount>({
			queryKey: ["profile", restClient.current, q],
			queryFn: queryFn,
			enabled: q !== undefined,
		});

	const _profile = useMemo(
		() => adaptUserProfile(data, accountState?.activeAccount?.domain),
		[status, accountState?.activeAccount?.domain]
	);

	if (!_profile) {
		return (
			<View>
				<Text>Not Found</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: "black",
			}}
			contentContainerStyle={{
				display: "flex",
				minHeight: "100%",
			}}
		>
			<Image
				source={{ uri: _profile.getBannerUrl() }}
				style={{ height: 48, width: Dimensions.get("window").width }}
			/>
			<View style={{ display: "flex", flexDirection: "row" }}>
				<AvatarContainerWithInset>
					<AvatarExpoImage source={{ uri: _profile.getAvatarUrl() }} />
				</AvatarContainerWithInset>
				<View style={{ flexGrow: 1 }}></View>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<View
						style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
					>
						<PrimaryText>{_profile.getPostCount()}</PrimaryText>
						<SecondaryText>Posts</SecondaryText>
					</View>
					<View
						style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
					>
						<PrimaryText>{_profile.getFollowingCount()}</PrimaryText>
						<SecondaryText>Following</SecondaryText>
					</View>
					<View
						style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
					>
						<PrimaryText>{_profile.getFollowersCount()}</PrimaryText>
						<SecondaryText>Followers</SecondaryText>
					</View>
				</View>
			</View>

			<View style={{ marginLeft: 8 }}>
				<PrimaryText>{_profile.getDispalyName()}</PrimaryText>
				<SecondaryText>@{_profile.getUsername()}</SecondaryText>
			</View>

			<View style={{ flex: 1, marginLeft: 8, marginRight: 8 }}>
				<Text style={{ color: "white" }}>{_profile.getDescription()}</Text>
			</View>

			<View style={{ flexGrow: 1 }} />
			<View style={{ marginBottom: 16 }}>
				<UserPostsProvider>
					<UserProfileBrowsePosts userId={_profile.getId()} />
				</UserPostsProvider>
			</View>
		</ScrollView>
	);
}

export default UserProfile;
