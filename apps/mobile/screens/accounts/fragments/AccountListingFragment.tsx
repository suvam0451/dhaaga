import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { memo, MutableRefObject, useState } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';
import { Account } from '../../../database/_schema';
import { AccountMetadataService } from '../../../database/entities/account-metadata';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AccountService } from '../../../database/entities/account';

type Props = {
	setIsExpanded: (isExpanded: boolean) => void;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	acct: Account;
};

type AccountOptionsProps = {
	IsExpanded: boolean;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	acct: Account;
};

const ICON_SIZE = 22;

export const AccountOptions = memo(function Foo({
	IsExpanded,
	dialogTarget,
	setDeleteDialogExpanded,
	acct,
}: AccountOptionsProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	console.log('account options...', IsExpanded);
	function onFixClicked() {
		// FIXME: point this to the sql account
		dialogTarget.current = acct;
	}

	const textStyle = {
		color: theme.textColor.medium,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 16,
		marginTop: 4,
	};

	return (
		<View
			style={{
				display: IsExpanded ? 'flex' : 'none',
				marginTop: 8,
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
						color={theme.textColor.medium}
					/>
					<Text style={textStyle}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={onFixClicked}>
					<MaterialIcons
						name="auto-fix-high"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text style={textStyle}>Fix</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Octicons
						name="sync"
						size={ICON_SIZE}
						color={theme.textColor.medium}
					/>
					<Text style={textStyle}>Sync</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => {
						dialogTarget.current = acct;
						setDeleteDialogExpanded(true);
					}}
				>
					<FontAwesome name="trash-o" size={ICON_SIZE} color={'#ce6779'} />
					<Text style={textStyle}>Remove</Text>
				</TouchableOpacity>
			</View>
		</View>
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
	const { colorScheme } = useAppTheme();
	return (
		<TouchableOpacity
			style={{ marginLeft: 8, flexGrow: 1 }}
			onPress={onClicked}
		>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					color: selected ? '#9dced7' : colorScheme.textColor.high,
				}}
				numberOfLines={1}
			>
				{displayName || ' '}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_400_REGULAR,
					color: selected ? '#9dced7' : colorScheme.textColor.low,
					fontSize: 12,
				}}
				numberOfLines={1}
			>
				@{username}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_400_REGULAR,
					color: selected ? '#9dced7' : colorScheme.textColor.medium,
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
	dialogTarget,
	setDeleteDialogExpanded,
	acct,
}: Props) {
	const { db, theme } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
			theme: o.colorScheme,
		})),
	);
	const [IsExpanded, setIsExpanded] = useState(false);

	const avatar = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		'avatar',
	);
	const displayName = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		'display_name',
	);

	if (!acct) return <View />;
	return (
		<View
			style={{
				backgroundColor: theme.palette.menubar,
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
						flexGrow: 1,
					}}
				>
					<AccountPfp
						selected={acct.selected as boolean}
						url={avatar}
						onClicked={() => {
							AccountService.select(db, acct);
						}}
					/>
					<AccountDetails
						onClicked={() => {
							AccountService.select(db, acct);
						}}
						selected={acct.selected as boolean}
						displayName={displayName}
						username={acct.username}
						subdomain={acct.server}
					/>
					{acct.selected && (
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								color: '#9dced7',
							}}
						>
							Active
						</Text>
					)}
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							paddingHorizontal: 12,
							paddingVertical: 12,
							flexDirection: 'row',
							alignItems: 'center',
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
				acct={acct}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#fff',
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
		paddingVertical: 6,
		alignItems: 'center',
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
});

export default AccountListingFragment;
