import { Fragment } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import SoftwareHeader from '../../../../../../screens/accounts/fragments/SoftwareHeader';
import AccountListingFragment from '../../../../../../screens/accounts/fragments/AccountListingFragment';
import NoAccounts from './NoAccounts';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Account } from '../../../../../../database/_schema';

type AccountListForSoftwareProps = {
	data: Account[];
	software: KNOWN_SOFTWARE;
	onListChange: () => void;
	style?: StyleProp<ViewStyle>;
};

function AccountListForSoftware({
	data,
	software,
	onListChange,
	style,
}: AccountListForSoftwareProps) {
	const filteredForSoftware = data.filter((o) => o.driver === software);
	return (
		<View style={style}>
			{filteredForSoftware.length == 0 ? (
				<NoAccounts service={software} />
			) : (
				<Fragment>
					<SoftwareHeader software={software} mb={4} mt={8} addText={true} />
					{filteredForSoftware.map((o, i) => (
						<AccountListingFragment
							key={i}
							acct={o}
							onListChange={onListChange}
						/>
					))}
				</Fragment>
			)}
		</View>
	);
}

export default AccountListForSoftware;
