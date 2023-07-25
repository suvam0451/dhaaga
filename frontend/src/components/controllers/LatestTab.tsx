import { Box, Flex } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import {
	LatestTabRendererState,
	latestTabRendererSlice,
} from "../../lib/redux/slices/latestTabRenderer";
import MastadonSearchColumn from "../columns/MastadonSearchColumn";
import {
	ProviderAuthState,
	providerAuthSlice,
} from "../../lib/redux/slices/authSlice";
import { useEffect } from "react";
import { GetCredentialsByAccountId } from "../../../wailsjs/go/main/App";
import { KeystoreService } from "../../services/keystore.services";
import MastadonUserProfileColumn from "../columns/MastadonUserProfileColumn";
import { ColumnGeneratorProps } from "../columns/columns.types";
import { COLUMNS } from "../utils/constansts";

function LatestTabRenderer() {
	const dispatch = useDispatch<AppDispatch>();
	const providerAuth = useSelector<RootState, ProviderAuthState>(
		(o) => o.providerAuth
	);
	const latestTabPushHistory = useSelector<RootState, LatestTabRendererState>(
		(o) => o.latestTabPushHistory
	);

	/**
	 * Load the access tokens for consumption
	 * by generated columns
	 */
	useEffect(() => {
		if (!providerAuth.selectedAccount) return;
		GetCredentialsByAccountId(providerAuth.selectedAccount!.id).then((res) => {
			const { success, data } = KeystoreService.verifyMastadonCredentials(
				providerAuth.selectedAccount?.subdomain!,
				res
			);

			if (success) {
				dispatch(providerAuthSlice.actions.setLoggedInCredentials(data!));
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
			}
		});
	}, [providerAuth.selectedAccount]);

	const ComponentMapper: Record<
		string,
		({ index, query }: ColumnGeneratorProps) => React.JSX.Element
	> = {
		[COLUMNS.MASTODON_V2_SEARCH]: MastadonSearchColumn,
		[COLUMNS.MASTODON_V1_PROFILE_OTHER]: MastadonUserProfileColumn,
	};

	return (
		<Flex direction={"row"} h={"100%"}>
			{latestTabPushHistory.stack.map((item, i) => {
				const Component = ComponentMapper[item.type];
				if (!Component) {
					return <Box h={"100%"} key={i}></Box>;
				}
				return (
					<Box mx={"0.25rem"} h={"100%"}>
						<Component key={i} index={i} query={item.query} />					</Box>
				)
			})}
		</Flex>
	);
}

export default LatestTabRenderer;
