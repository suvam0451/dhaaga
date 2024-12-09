import { Fragment, MutableRefObject } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import SoftwareHeader from '../../../../../../screens/accounts/fragments/SoftwareHeader';
import AccountListingFragment from '../../../../../../screens/accounts/fragments/AccountListingFragment';
import NoAccounts from './NoAccounts';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useAccountDbContext } from '../../settings/hooks/useAccountDb';
import { Account } from '../../../../../../database/_schema';

type AccountListForSoftwareProps = {
	software: KNOWN_SOFTWARE;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	style?: StyleProp<ViewStyle>;
};

function AccountListForSoftware({
	software,
	setIsExpanded,
	setDeleteDialogExpanded,
	dialogTarget,
	style,
}: AccountListForSoftwareProps) {
	const { accounts } = useAccountDbContext();
	const data = accounts.filter((o) => o.driver === software);

	return (
		<View style={style}>
			{data.length == 0 ? (
				<NoAccounts service={software} />
			) : (
				<Fragment>
					<SoftwareHeader software={software} mb={4} mt={8} />
					{data.map((o, i) => (
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
