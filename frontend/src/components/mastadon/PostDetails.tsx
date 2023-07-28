import { useEffect, useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import { ModuleAuthHook } from "../../contexts/AuthContext";
import { mastodon } from "masto";
import { Text } from "@mantine/core";

/**
 * Shows details for a post
 * Wraps the existing PostListing component
 * @param param0
 */
function MastadonPostDetails({ id }: { id: string }) {
	const { store, dispatch } = ModuleAuthHook();
	const [PostData, setPostData] = useState<mastodon.v1.Status | null>(null);

	useEffect(() => {
		if (PostData) return;
		dispatch.verifyAuthStatus().then((res) => {
			if (!res || res.provider !== "mastodon") return;
			MastadonService.fetchStatus(
				res.creds.instanceUrl,
				res.creds.accessToken,
				id
			).then((res) => {
				console.log(res);
			});
		});
	}, [id]);

	return <Text>Hey, I am post</Text>;
}

export default MastadonPostDetails;
