import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useObject, useRealm } from '@realm/react';
import { Account } from '../../../entities/account.entity';
import AccountRepository from '../../../repositories/account.repo';
import AccountService from '../../../services/account.service';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { memo, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { APP_FONTS } from '../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { EmojiService } from '../../../services/emoji.service';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { UUID } from 'bson';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

type Props = {
	id: UUID;
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: React.MutableRefObject<UUID>;
	acct: Account;
};

type AccountOptionsProps = {
	IsExpanded: boolean;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: React.MutableRefObject<UUID>;
	acctId: UUID;
};

const ICON_SIZE = 22;

export const AccountOptions = memo(function Foo({
	IsExpanded,
	dialogTarget,
	setDeleteDialogExpanded,
	acctId,
}: AccountOptionsProps) {
	const acct = useObject(Account, acctId);

	function onFixClicked() {
		dialogTarget.current = acct._id;
		// setIsDialogExpanded(true);
	}
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
					alignItems: 'center',
					marginVertical: 8,
					paddingVertical: 4,
				}}
			>
				<TouchableOpacity style={styles.actionButton}>
					<Octicons
						name="browser"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							fontSize: 12,
							marginTop: 4,
						}}
					>
						Account
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={onFixClicked}>
					<MaterialIcons
						name="auto-fix-high"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							fontSize: 12,
							marginTop: 4,
						}}
					>
						Fix
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Octicons
						name="sync"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							fontSize: 12,
							marginTop: 4,
						}}
					>
						Sync
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => {
						dialogTarget.current = acctId;
						setDeleteDialogExpanded(true);
					}}
				>
					<FontAwesome name="trash-o" size={ICON_SIZE} color={'#ce6779'} />
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							fontSize: 12,
							marginTop: 4,
						}}
					>
						Remove
					</Text>
				</TouchableOpacity>
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
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
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
	const { globalDb } = useGlobalMmkvContext();
	const { regenerate } = useActivityPubRestClientContext();
	const [IsExpanded, setIsExpanded] = useState(false);

	const avatar = AccountRepository.findSecret(db, account, 'avatar')?.value;
	const displayName = AccountRepository.findSecret(
		db,
		account,
		'display_name',
	)?.value;

	async function onProfileClicked() {
		if (account.selected) {
			AccountService.deselectAccount(db, account._id);
		} else {
			AccountService.selectAccount(db, account._id);
			await EmojiService.refresh(db, globalDb, account.subdomain, true);
		}
		regenerate();
		router.navigate('/accounts/dashboard');
	}

	async function onAccountSelection() {
		if (account.selected) {
			AccountService.deselectAccount(db, account._id);
		} else {
			AccountService.selectAccount(db, account._id);
			await EmojiService.refresh(db, globalDb, account.subdomain, true);
		}
		regenerate();
	}

	if (!account) return <View />;
	return (
		<View
			style={{
				backgroundColor: '#202020',
				padding: 8,
				paddingVertical: 6,
				marginBottom: 8,
				borderRadius: 8,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<AccountPfp
						selected={account.selected}
						url={avatar}
						onClicked={onProfileClicked}
					/>
					<AccountDetails
						onClicked={onProfileClicked}
						selected={account.selected}
						displayName={displayName}
						username={account.username}
						subdomain={account.subdomain}
					/>
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							alignItems: 'center',
							paddingHorizontal: 12,
							paddingVertical: 12,
						}}
						onPress={onAccountSelection}
					>
						{account.selected ? (
							<Text
								style={{
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
									color: '#9dced7',
								}}
							>
								Active
							</Text>
						) : (
							<Text
								style={{
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
									color: APP_FONT.MONTSERRAT_HEADER,
								}}
							>
								Select
							</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							paddingHorizontal: 4,
							paddingVertical: 12,
							paddingLeft: 8,
							paddingRight: 8,
							flexDirection: 'row',
							alignItems: 'center',
							// backgroundColor: 'yellow',
						}}
						onPress={() => {
							setIsExpanded((o) => !o);
						}}
					>
						<Feather
							name="more-horizontal"
							size={24}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<AccountOptions
				IsExpanded={IsExpanded}
				dialogTarget={dialogTarget}
				setDeleteDialogExpanded={setDeleteDialogExpanded}
				acctId={acct._id}
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
		flex: 1,
		elevation: 1,
		backgroundColor: '#333333',
		borderRadius: 8,
		paddingVertical: 6,
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
