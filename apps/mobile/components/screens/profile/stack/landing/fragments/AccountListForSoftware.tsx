import { Fragment, memo, MutableRefObject } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import SoftwareHeader from '../../../../../../screens/accounts/fragments/SoftwareHeader';
import AccountListingFragment from '../../../../../../screens/accounts/fragments/AccountListingFragment';
import { Account } from '../../../../../../entities/account.entity';
import { useQuery } from '@realm/react';
import NoAccounts from './NoAccounts';
import { StyleProp, View, ViewStyle } from 'react-native';
import { UUID } from 'bson';

type AccountListForSoftwareProps = {
	software: KNOWN_SOFTWARE;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<UUID>;
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
				{accounts.length == 0 ? (
					<NoAccounts service={software} />
				) : (
					<Fragment>
						<SoftwareHeader software={software} mb={4} mt={8} />
						{accounts.map((o, i) => (
							<AccountListingFragment
								key={i}
								id={o._id}
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
	},
);

export default AccountListForSoftware;
