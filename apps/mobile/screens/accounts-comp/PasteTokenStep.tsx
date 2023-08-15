import { Button, Divider } from "@rneui/base";
import { StandardView } from "../../styles/Containers";
import { MainText } from "../../styles/Typography";
import { Text } from "react-native";
import { AccountsRepo } from "../../libs/sqlite/repositories/accounts.repo";
import {
	MastodonService,
	RestClient,
	RestServices,
} from "@dhaaga/shared-provider-mastodon/src";

type PasteTokenStepProps = {
	Subdomain: string;
	Code: string | null;
};

function PasteTokenStep({ Subdomain, Code }: PasteTokenStepProps) {
	async function onPressConfirm() {
		const token = await MastodonService.getAccessToken(
			Subdomain,
			Code,
			process.env.EXPO_PUBLIC_MASTODON_CLIENT_ID,
			process.env.EXPO_PUBLIC_MASTODON_CLIENT_SECRET
		);

		const client = new RestClient(Subdomain, token);
		const verified =
			await RestServices.v1.default.accounts.default.verifyCredentials(client);
		
		AccountsRepo.add({
			subdomain: Subdomain,
			domain: "mastodon",
			username: verified.username,
		});
	}

	if (Code === null) return <></>;

	return (
		<StandardView
			style={{
				display: "flex",
				justifyContent: "flex-start",
				marginTop: 12,
				marginBottom: 8,
			}}
		>
			<Divider style={{ marginTop: 4, marginBottom: 4 }} />
			<MainText style={{ marginBottom: 12 }}>
				Step 3: Confirm your account
			</MainText>
			<Text style={{ marginBottom: 12 }}>
				A valid token was detected. Proceed with adding the account shown above?
			</Text>
			<Button onPress={onPressConfirm}>Proceed</Button>
		</StandardView>
	);
}

export default PasteTokenStep;
