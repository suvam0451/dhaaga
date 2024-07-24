import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { useObject, useRealm } from '@realm/react';
import { Account } from '../../../entities/account.entity';
import AccountRepository from '../../../repositories/account.repo';
import { Types } from 'realm';
import UUID = Types.UUID;
import AccountService from '../../../services/account.service';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { memo, useMemo, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { APP_FONT } from '../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppButtonVariantA } from '../../../components/lib/Buttons';

type Props = {
	id: UUID;
};

type AccountOptionsProps = {
	IsExpanded: boolean;
};

const AccountOptions = memo(function Foo({ IsExpanded }: AccountOptionsProps) {
	return (
		<Animated.View
			entering={FadeIn}
			style={{ display: IsExpanded ? 'flex' : 'none', marginTop: 16 }}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-around',
					marginVertical: 16,
				}}
			>
				<Button
					size={'md'}
					buttonStyle={{ backgroundColor: '#333333', borderRadius: 8 }}
					containerStyle={{ borderRadius: 8 }}
					// onPress={onPress}
					// onLongPress={onLongPress}
				>
					<Text style={{ color: APP_FONT.MONTSERRAT_HEADER, fontSize: 14 }}>
						Sync Hashtags
					</Text>
					<View style={{ marginLeft: 8 }}>
						<FontAwesome
							name="refresh"
							size={20}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</Button>

				<Button
					size={'md'}
					buttonStyle={{ backgroundColor: '#333333', borderRadius: 8 }}
					containerStyle={{ borderRadius: 8 }}
					// onPress={onPress}
					// onLongPress={onLongPress}
				>
					<Text style={{ color: APP_FONT.MONTSERRAT_HEADER }}>
						Sync Followers
					</Text>
					<View style={{ marginLeft: 8 }}>
						<FontAwesome
							name="refresh"
							size={20}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</Button>
			</View>
		</Animated.View>
	);
});

function AccountListingFragment({ id }: Props) {
	const account = useObject(Account, id);
	const db = useRealm();
	const { primaryAcct, regenerate } = useActivityPubRestClientContext();
	const [IsExpanded, setIsExpanded] = useState(false);

	const avatar = AccountRepository.findSecret(db, account, 'avatar')?.value;
	const displayName = AccountRepository.findSecret(
		db,
		account,
		'display_name',
	)?.value;

	function onSelectAccount(o: Account) {
		AccountService.selectAccount(db, o._id);
		regenerate();
	}

	function onDeselectAccount(o: Account) {
		AccountService.deselectAccount(db, o._id);
		regenerate();
	}

	const isActive = useMemo(() => {
		return (
			primaryAcct?._id?.toString() === account._id.toString() &&
			account.selected
		);
	}, [primaryAcct, account?.selected]);

	return (
		<View
			style={{
				backgroundColor: '#282828',
				padding: 8,
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
				<View>
					{avatar && (
						<View style={{ height: 48, width: 48 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								style={styles.image}
								source={avatar}
								contentFit="fill"
								transition={1000}
							/>
						</View>
					)}
				</View>
				<View style={{ marginLeft: 8, flexGrow: 1 }}>
					<Text
						style={{
							fontWeight: '500',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						{displayName || ' '}
					</Text>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontSize: 14,
						}}
					>
						{account.username}
					</Text>
					<Text style={{ color: APP_FONT.MONTSERRAT_HEADER, fontSize: 14 }}>
						{account.subdomain}
					</Text>
				</View>
				<View
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						flexDirection: 'row',
						marginRight: 8,
						alignItems: 'center',
					}}
				>
					{!isActive ? (
						<TouchableOpacity
							onPress={() => {
								onSelectAccount(account);
							}}
						>
							<FontAwesome5
								name="check-square"
								size={28}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={() => {
								onDeselectAccount(account);
							}}
						>
							<FontAwesome5 name="check-square" size={28} color={'green'} />
						</TouchableOpacity>
					)}
				</View>
				<TouchableOpacity
					style={{ paddingHorizontal: 8, paddingVertical: 8 }}
					onPress={() => {
						setIsExpanded((o) => !o);
					}}
				>
					<Entypo
						name="chevron-down"
						size={32}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</TouchableOpacity>
			</View>
			<AccountOptions IsExpanded={IsExpanded} />
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
		backgroundColor: '#0553',
	},
});

export default AccountListingFragment;
