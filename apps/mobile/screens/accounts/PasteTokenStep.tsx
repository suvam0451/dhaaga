import { Button, Divider } from "@rneui/base";
import { StandardView } from "../../styles/Containers";
import { MainText } from "../../styles/Typography";
import { Text } from "react-native";

function PasteTokenStep() {
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
			<Button>Proceed</Button>
		</StandardView>
	);
}

export default PasteTokenStep;
