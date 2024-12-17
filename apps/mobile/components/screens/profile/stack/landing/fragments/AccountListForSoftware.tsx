import { Fragment, MutableRefObject } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import SoftwareHeader from '../../../../../../screens/accounts/fragments/SoftwareHeader';
import AccountListingFragment from '../../../../../../screens/accounts/fragments/AccountListingFragment';
import NoAccounts from './NoAccounts';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Account } from '../../../../../../database/_schema';

type AccountListForSoftwareProps = {
	data: Account[];
	software: KNOWN_SOFTWARE;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	style?: StyleProp<ViewStyle>;
};

function AccountListForSoftware({
	data,
	software,
	setIsExpanded,
	setDeleteDialogExpanded,
	dialogTarget,
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
							setIsExpanded={setIsExpanded}
							dialogTarget={dialogTarget}
							setDeleteDialogExpanded={setDeleteDialogExpanded}
							acct={o}
						/>
					))}
				</Fragment>
			)}
		</View>
	);
}

export default AccountListForSoftware;
