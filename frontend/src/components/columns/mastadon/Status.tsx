import { useEffect, useState } from "react";
import { MastadonService } from "../../../services/mastadon.service";
import { ModuleAuthHook } from "../../../contexts/AuthContext";
import { mastodon } from "masto";
import { Box } from "@mantine/core";
import { ColumnGeneratorProps } from "../columns.types";
import { COLUMN_MIN_WIDTH } from "../../../constants/app-dimensions";
import MastadonPostListing from "../../mastadon/PostListing";
import AdvancedScrollAreaProvider from "../../../contexts/AdvancedScrollArea";
import AdvancedScrollArea from "../../navigation/AdvancedScrollArea";
import DiscoverModuleBreadcrumbs from "../../navigation/NavigationBreadcrumbs";
import MastadonStatusInteractions from "../../mastadon/MastodonStatusInteraction";

/**
 * Shows details for a post
 * Wraps the existing PostListing component
 * @param param0
 */
function MastadonPostDetails({ index, query }: ColumnGeneratorProps) {
	const { store, dispatch } = ModuleAuthHook();
	const [PostData, setPostData] = useState<mastodon.v1.Status | null>(null);

	useEffect(() => {
		if (PostData || !query.id) return;
		dispatch.verifyAuthStatus().then((res) => {
			if (!res || res.provider !== "mastodon") return;
			MastadonService.fetchStatus(
				res.creds.instanceUrl,
				res.creds.accessToken,
				query.id as any
			).then((res) => {
				setPostData(res);
			});
		});
	}, [query.id]);

	useEffect(() => {
		return () => {};
	}, [PostData]);

	return (
		<Box h={"100%"} miw={COLUMN_MIN_WIDTH}>

		<AdvancedScrollAreaProvider>
			<DiscoverModuleBreadcrumbs index={index} />
			<AdvancedScrollArea>
				{PostData && <MastadonPostListing post={PostData} />}
				{PostData && <MastadonStatusInteractions post={PostData} />}
			</AdvancedScrollArea>
		</AdvancedScrollAreaProvider>
					
		</Box>
	);
}

export default MastadonPostDetails;
