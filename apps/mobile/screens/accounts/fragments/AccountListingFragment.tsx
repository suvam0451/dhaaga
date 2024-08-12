import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useObject, useRealm } from '@realm/react';
import { Account } from '../../../entities/account.entity';
import AccountRepository from '../../../repositories/account.repo';
import { Types } from 'realm';
import UUID = Types.UUID;
import AccountService from '../../../services/account.service';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { Fragment, memo, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../styles/AppTheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { APP_FONTS } from '../../../styles/AppFonts';
import { SoftwareBadgeUpdateAccountOnClick } from '../../../components/common/software/SimpleBadge';
import { FontAwesome } from '@expo/vector-icons';
import useAppCustomEmoji from '../../../hooks/app/useAppCustomEmoji';

type Props = {
	id: UUID;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: React.MutableRefObject<Account>;
	acct: Account;
};

type AccountOptionsProps = {
	IsExpanded: boolean;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: React.MutableRefObject<Account>;
	acct: Account;
};

export const AccountOptions = memo(function Foo({
	IsExpanded,
	dialogTarget,
	setDeleteDialogExpanded,
	acct,
}: AccountOptionsProps) {
	return (
		<Animated.View
			entering={FadeIn}
			style={{
				display: IsExpanded ? 'flex' : 'none',
				marginTop: 8,
				backgroundColor: '#121212',
				paddingHorizontal: 8,
				borderRadius: 8,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					marginTop: 16,
					alignItems: 'center',
					marginVertical: 8,
				}}
			>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<View style={styles.actionButton}>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_400_REGULAR,
								color: APP_FONT.MONTSERRAT_HEADER,
								fontSize: 13,
							}}
						>
							Sync Hashtags
						</Text>
					</View>
					<Text style={styles.syncStatusText}>Not Synced</Text>
				</View>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<View style={styles.actionButton}>
						<Text
							style={{
								fontFamily: APP_FONTS.INTER_400_REGULAR,
								color: APP_FONT.MONTSERRAT_HEADER,
								fontSize: 13,
							}}
						>
							Sync Followers
						</Text>
					</View>
					<Text style={styles.syncStatusText}>Not Synced</Text>
				</View>
				<View
					style={{
						flexGrow: 1,
						flexDirection: 'row',
						justifyContent: 'flex-end',
					}}
				>
					<View
						style={{ paddingRight: 8, padding: 8 }}
						onTouchEnd={() => {
							dialogTarget.current = acct;
							setDeleteDialogExpanded(true);
						}}
					>
						<FontAwesome name="trash-o" size={24} color={'rgba(255,0,0,0.8)'} />
					</View>
				</View>
			</View>
		</Animated.View>
	);
});

type AccountPfpProps = {
	url: string;
	selected: boolean;
	onClicked: () => void;
};
export const AccountPfp = memo(function Foo({
	url,
	selected,
	onClicked,
}: AccountPfpProps) {
	return (
		<TouchableOpacity
			style={{
				height: 48,
				width: 48,
				borderRadius: 8,
				borderWidth: 1.5,
				borderColor: selected ? '#9dced7' : 'gray',
			}}
			onPress={onClicked}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				style={styles.image}
				source={{ uri: url }}
				contentFit="fill"
				transition={1000}
			/>
			<View
				style={[
					{
						display: selected ? 'flex' : 'none',
					},
					styles.selectedIndicator,
				]}
			/>
		</TouchableOpacity>
	);
});

type selectedIndicatorProps = {
	displayName?: string;
	username: string;
	subdomain: string;
	selected: boolean;
	onClicked: () => void;
};
export const AccountDetails = memo(function Foo({
	displayName,
	username,
	selected,
	subdomain,
	onClicked,
}: selectedIndicatorProps) {
	return (
		<TouchableOpacity
			style={{ marginLeft: 8, flexGrow: 1 }}
			onPress={onClicked}
		>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
					color: selected ? '#9dced7' : APP_FONT.MONTSERRAT_HEADER,
				}}
				numberOfLines={1}
			>
				{displayName || ' '}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_400_REGULAR,
					color: selected ? '#9dced7' : APP_FONT.MONTSERRAT_BODY,
					fontSize: 12,
				}}
				numberOfLines={1}
			>
				@{username}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_400_REGULAR,
					color: selected ? '#9dced7' : APP_FONT.MONTSERRAT_HEADER,
					fontSize: 12,
				}}
				numberOfLines={1}
			>
				{subdomain}
			</Text>
		</TouchableOpacity>
	);
});

function AccountListingFragment({
	id,
	setIsExpanded: setIsDialogExpanded,
	dialogTarget,
	setDeleteDialogExpanded,
	acct,
}: Props) {
	const account = useObject(Account, id);
	const db = useRealm();
	const { regenerate } = useActivityPubRestClientContext();
	const [IsExpanded, setIsExpanded] = useState(false);

	const { refresh } = useAppCustomEmoji();
	const avatar = AccountRepository.findSecret(db, account, 'avatar')?.value;
	const displayName = AccountRepository.findSecret(
		db,
		account,
		'display_name',
	)?.value;

	function onSoftwareClicked() {
		dialogTarget.current = account;
		setIsDialogExpanded(true);
	}

	function onAccountSelection() {
		if (account.selected) {
			AccountService.deselectAccount(db, account._id);
		} else {
			AccountService.selectAccount(db, account._id);
			refresh(account.subdomain, account.domain);
		}
		regenerate();
	}

	if (!account) return <View />;
	return (
		<View
			style={{
				backgroundColor: '#282828',
				padding: 8,
				marginBottom: 8,
				borderRadius: 8,
				maxWidth: '100%',
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<AccountPfp
					selected={account.selected}
					url={avatar}
					onClicked={onAccountSelection}
				/>
				<AccountDetails
					onClicked={onAccountSelection}
					selected={account.selected}
					displayName={displayName}
					username={account.username}
					subdomain={account.subdomain}
				/>

				<View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
					<TouchableOpacity onPress={onSoftwareClicked}>
						<SoftwareBadgeUpdateAccountOnClick acct={account} />
					</TouchableOpacity>

					<View
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							style={{
								paddingHorizontal: 4,
								paddingLeft: 8,
								flexDirection: 'row',
								alignItems: 'center',
							}}
							onPress={() => {
								setIsExpanded((o) => !o);
							}}
						>
							{IsExpanded ? (
								<Fragment>
									<Text
										style={{
											fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
											color: APP_FONT.MONTSERRAT_HEADER,
										}}
									>
										Less
									</Text>
									<Entypo
										name="chevron-up"
										size={32}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</Fragment>
							) : (
								<Fragment>
									<Text
										style={{
											fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
											color: APP_FONT.MONTSERRAT_HEADER,
										}}
									>
										More
									</Text>
									<Entypo
										name="chevron-down"
										size={32}
										color={APP_FONT.MONTSERRAT_BODY}
									/>
								</Fragment>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<AccountOptions
				IsExpanded={IsExpanded}
				dialogTarget={dialogTarget}
				setDeleteDialogExpanded={setDeleteDialogExpanded}
				acct={acct}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		width: '100%',
		borderRadius: 6,
	},
	actionButton: {
		elevation: 1,
		backgroundColor: '#333333',
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		shadowRadius: 8,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		marginRight: 8,
	},
	selectedIndicator: {
		position: 'absolute',
		height: 16,
		width: 16,
		backgroundColor: '#9dced7',
		zIndex: 99,
		right: 0,
		bottom: 0,
		borderTopLeftRadius: 8,
		borderBottomEndRadius: 4,
	},
	syncStatusText: {
		fontSize: 11,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		color: APP_FONT.MONTSERRAT_BODY,
		textAlign: 'center',
		width: '100%',
		marginRight: 8,
	},
});

export default AccountListingFragment;
