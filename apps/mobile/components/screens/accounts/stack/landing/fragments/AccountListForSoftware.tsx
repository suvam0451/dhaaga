import { memo, MutableRefObject } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import SoftwareHeader from '../../../../../../screens/accounts/fragments/SoftwareHeader';
import AccountListingFragment from '../../../../../../screens/accounts/fragments/AccountListingFragment';
import { Account } from '../../../../../../entities/account.entity';
import { useQuery } from '@realm/react';
import NoAccounts from './NoAccounts';
import { StyleProp, View, ViewStyle } from 'react-native';

type AccountListForSoftwareProps = {
	software: KNOWN_SOFTWARE;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	style?: StyleProp<ViewStyle>;
};

const AccountListForSoftware = memo(
	({
		software,
		setIsExpanded,
		setDeleteDialogExpanded,
		dialogTarget,
		style,
	}: AccountListForSoftwareProps) => {
		const accounts: Account[] = useQuery(Account).filter(
			(o: Account) => o.domain === software,
		);

		return (
			<View style={style}>
				<SoftwareHeader software={software} mb={4} mt={12} />
				{accounts.length == 0 ? (
					<NoAccounts service={software} />
				) : (
					accounts.map((o, i) => (
						<AccountListingFragment
							key={i}
							id={o._id}
							setIsExpanded={setIsExpanded}
							dialogTarget={dialogTarget}
							setDeleteDialogExpanded={setDeleteDialogExpanded}
							acct={o}
						/>
					))
				)}
			</View>
		);
	},
);

export default AccountListForSoftware;
