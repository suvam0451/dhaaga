import { Box, Flex } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
	LatestTabRendererState,
	latestTabRendererSlice,
} from "../../lib/redux/slices/latestTabRenderer";
import MastadonSearchColumn from "../columns/MastadonSearchColumn";
import {
	providerAuthSlice,
} from "../../lib/redux/slices/authSlice";
import { useEffect } from "react";
import MastadonUserProfileColumn from "../columns/MastadonUserProfileColumn";
import { ColumnGeneratorProps } from "../columns/columns.types";
import { COLUMNS } from "../utils/constansts";
import MastadonTimelineColumn from "../columns/MastadonTimelineColumn";
import { useLocation } from "react-router-dom";
import { ModuleAuthHook } from "../../contexts/AuthContext";
import Status from "../columns/mastadon/Status";

function LatestTabRenderer() {
	const dispatch = useDispatch<AppDispatch>();
	const { store: moduleAuthStore, dispatch: moduleAuthDispatch } =
		ModuleAuthHook();
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);
	const router = useLocation();

	/**
	 * Load the access tokens for consumption
	 * by generated columns
	 */
	useEffect(() => {
		moduleAuthDispatch.verifyAuthStatus().then((res) => {
			if (!res) return;
			if (res.provider === "mastodon") {
				dispatch(providerAuthSlice.actions.setLoggedInCredentials(res.creds));

				switch (router.pathname) {
					case "/latest": {
						dispatch(
							latestTabRendererSlice.actions.setStack([
								{
									type: COLUMNS.MASTODON_V2_SEARCH,
									query: {
										q: "",
									},
									label: "Discover",
								},
							])
						);
						break;
					}
					case "/gallery": {
						dispatch(
							latestTabRendererSlice.actions.setStack([
								{
									type: COLUMNS.MASTODON_V1_TIMELINE_PUBLIC,
									query: {},
									label: "Timelines",
								},
							])
						);
						break;
					}
					default: {
						break;
					}
				}
			}
		});
	}, [moduleAuthStore, router.pathname]);

	const ComponentMapper: Record<
		string,
		({ index, query }: ColumnGeneratorProps) => React.JSX.Element
	> = {
		[COLUMNS.MASTODON_V2_SEARCH]: MastadonSearchColumn,
		[COLUMNS.MASTODON_V1_PROFILE_OTHER]: MastadonUserProfileColumn,
		[COLUMNS.MASTODON_V1_TIMELINE_PUBLIC]: MastadonTimelineColumn,
		[COLUMNS.MASTADON_V1_STATUS]: Status
	};

	return (
		<Flex direction={"row"} h={"100%"}>
			{latestTabPushHistory.stack.map((item, i) => {
				const Component = ComponentMapper[item.type];
				if (!Component) {
					return <Box h={"100%"} key={i}></Box>;
				}
				return (
					<Box mx={"0.25rem"} h={"100%"} key={i}>
						<Component key={i} index={i} query={item.query} />{" "}
					</Box>
				);
			})}
		</Flex>
	);
}

export default LatestTabRenderer;
