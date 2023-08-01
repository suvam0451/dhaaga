import { useEffect, useState } from "react";
import { MastadonService } from "../../../services/mastadon.service";
import { ModuleAuthHook } from "../../../contexts/AuthContext";
import { mastodon } from "masto";
import { Box, LoadingOverlay } from "@mantine/core";
import { ColumnGeneratorProps } from "../columns.types";
import { COLUMN_MIN_WIDTH } from "../../../constants/app-dimensions";
import MastadonPostListing from "../../mastadon/PostListing";
import AdvancedScrollAreaProvider from "../../../contexts/AdvancedScrollArea";
import AdvancedScrollArea from "../../navigation/AdvancedScrollArea";
import DiscoverModuleBreadcrumbs from "../../navigation/NavigationBreadcrumbs";
import MastadonStatusInteractions from "../../mastadon/MastodonStatusInteraction";
import { useQuery } from "@tanstack/react-query";

/**
 * Shows details for a post
 * Wraps the existing PostListing component
 * @param param0
 */
function MastadonPostDetails({ index, query }: ColumnGeneratorProps) {
	const { store, dispatch } = ModuleAuthHook();

	async function getStatus(id: number | string) {
		if (!query.id) return Promise.reject(new Error("no status found"));
		const auth = await dispatch.verifyAuthStatus();

		if (!auth || auth.provider !== "mastodon")
			return Promise.reject(new Error("no status found"));
		return MastadonService.fetchStatus(
			auth.creds.instanceUrl,
			auth.creds.accessToken,
			id as any
		);
	}

	const { status, data } = useQuery({
		queryKey: ["mastodon/v1/status", query.id],
		queryFn: () => getStatus(query.id),
	});

	return (
		<Box h={"100%"} miw={COLUMN_MIN_WIDTH}>
			<AdvancedScrollAreaProvider>
				<DiscoverModuleBreadcrumbs index={index} />
				<AdvancedScrollArea>
					<LoadingOverlay
						h={"100%"}
						visible={status === "pending"}
						overlayBlur={2}
						transitionDuration={500}
						w={"100%"}
					/>
					{data && <MastadonPostListing post={data} index={0} />}
					{data && <MastadonStatusInteractions post={data} />}
				</AdvancedScrollArea>
			</AdvancedScrollAreaProvider>
		</Box>
	);
}

export default MastadonPostDetails;
