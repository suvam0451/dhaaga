import {
	AccountDetails,
	AccountPfp,
} from '../../../screens/accounts/fragments/AccountListingFragment';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Account } from '../../../database/_schema';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../database/entities/account-metadata';

type AppAccountSelectionItemProps = {
	style?: StyleProp<ViewStyle>;
	acct: Account;
	RightComponent?: any;
	onPress?: () => void;
};

/**
 * Used for the account listing page,
 * account switcher bottom sheet, add
 * profile sheet
 * @param style
 * @param acct
 * @param RightComponent
 * @param onPress
 * @constructor
 */
export function AppAccountSelectionItem({
	style,
	acct,
	RightComponent,
	onPress,
}: AppAccountSelectionItemProps) {
	const { db } = useAppDb();
	const displayName = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		ACCOUNT_METADATA_KEY.DISPLAY_NAME,
	);

	function _onPress() {
		if (onPress) {
			onPress();
		}
	}

	return (
		<Pressable
			style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
			onPress={_onPress}
		>
			<AccountPfp url={acct.avatarUrl} selected={false} onClicked={_onPress} />
			<View style={{ flex: 1 }}>
				<AccountDetails
					onClicked={_onPress}
					selected={false}
					displayName={displayName}
					username={acct.username}
					subdomain={acct.server}
				/>
			</View>
			{RightComponent}
		</Pressable>
	);
}
