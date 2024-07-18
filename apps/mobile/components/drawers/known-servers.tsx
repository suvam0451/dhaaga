import { Drawer } from 'react-native-drawer-layout';
import { Button, Divider, Text } from '@rneui/themed';
import { useAppDrawerContext } from '../../states/useAppDrawer';
import { TouchableOpacity, View } from 'react-native';
import { useAssets } from 'expo-asset';
import { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import VersionCode from '../static/sponsorship/VersionCode';
import { APP_FONT } from '../../styles/AppTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFabController } from '../shared/fab/hooks/useFabController';
import Coffee from '../static/sponsorship/Coffee';

type Props = {
	children: any;
};

const DRAWER_BG_COLOR = '#262626';

/**
 * Drawer content for "Known Servers"
 * module.
 *
 * Requires AppDrawerContext
 */
function KnownServersDrawer({ children }: Props) {
	const { open, setOpen } = useAppDrawerContext();
	const { setActiveMenu } = useFabController();

	useEffect(() => {
		setActiveMenu(open ? 'drawer' : 'fab');
	}, [open]);

	const [assets, error] = useAssets([require('../../assets/bmc-button.png')]);
	const { primaryAcct } = useActivityPubRestClientContext();

	const [IsAssetsLoaded, setIsAssetsLoaded] = useState(false);
	useEffect(() => {
		setIsAssetsLoaded(!error && assets?.every((o) => o?.downloaded));
	}, [assets, error]);

	const ProfileInfo = useMemo(() => {
		if (primaryAcct) {
			return (
				<View>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							fontSize: 20,
							color: APP_FONT.MONTSERRAT_HEADER,
							marginTop: 16,
						}}
					>
						Logged in as
					</Text>
					<View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
						<View style={{ width: 48, height: 48 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								source={primaryAcct.avatarUrl}
								style={{ width: 48, height: 48 }}
							/>
						</View>
						<View style={{}}>
							{/*<Text>{primaryAcct.secrets}</Text>*/}
							<Text>@{primaryAcct.username}</Text>
							<Text>{primaryAcct.subdomain}</Text>
						</View>
					</View>
				</View>
			);
		} else {
			return <View></View>;
		}
	}, [primaryAcct]);

	return (
		<Drawer
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			renderDrawerContent={() => {
				if (!IsAssetsLoaded) {
					return (
						<View
							style={{
								backgroundColor: '#262626',
								height: '100%',
								padding: 16,
							}}
						></View>
					);
				}
				return (
					<View
						style={{
							backgroundColor: '#262626',
							height: '100%',
							padding: 16,
							paddingBottom: 0,
							display: 'flex',
						}}
					>
						<View style={{ flexGrow: 1 }}>
							<View>
								<MaterialIcons
									name="close"
									size={24}
									color={APP_FONT.MONTSERRAT_HEADER}
									onPress={() => {
										setOpen(false);
									}}
								/>
								{ProfileInfo}
								<Divider style={{ height: 4, marginVertical: 16 }} />
								<Text
									style={{
										fontFamily: 'Montserrat-Bold',
										color: APP_FONT.MONTSERRAT_HEADER,
										fontSize: 20,
									}}
								>
									Page Actions
								</Text>
								<Text
									style={{
										marginBottom: 16,
										color: APP_FONT.MONTSERRAT_HEADER,
									}}
								>
									Known Server
								</Text>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<View style={{ width: 24 }}>
										<FontAwesome5
											name="sync-alt"
											size={20}
											color={APP_FONT.MONTSERRAT_HEADER}
										/>
									</View>
									<View style={{ marginLeft: 8 }}>
										<Text style={{ fontSize: 16 }}>Update Software Data</Text>
									</View>
								</View>

								<Divider style={{ height: 4, marginVertical: 16 }} />
							</View>
						</View>
						<Coffee />
						<VersionCode />
						{/*<View*/}
						{/*	style={{*/}
						{/*		position: 'absolute',*/}
						{/*		bottom: 64,*/}
						{/*		left: -48,*/}
						{/*		transform: [{ rotate: '-90deg' }],*/}
						{/*	}}*/}
						{/*>*/}
						{/*	<TouchableOpacity*/}
						{/*		onPress={() => {*/}
						{/*			setOpen(false);*/}
						{/*		}}*/}
						{/*	>*/}
						{/*		<View*/}
						{/*			style={{*/}
						{/*				backgroundColor: DRAWER_BG_COLOR,*/}
						{/*				paddingHorizontal: 16,*/}
						{/*				paddingVertical: 8,*/}
						{/*				marginBottom: 10,*/}
						{/*				paddingBottom: 30,*/}
						{/*				borderRadius: 8,*/}
						{/*				borderBottomLeftRadius: 0,*/}
						{/*				borderBottomRightRadius: 0,*/}

						{/*				display: 'flex',*/}
						{/*				flexDirection: 'row',*/}
						{/*				alignItems: 'center',*/}
						{/*			}}*/}
						{/*		>*/}
						{/*			<MaterialIcons*/}
						{/*				name="close"*/}
						{/*				size={24}*/}
						{/*				color={APP_FONT.MONTSERRAT_HEADER}*/}
						{/*			/>*/}
						{/*			<Text*/}
						{/*				style={{*/}
						{/*					marginLeft: 8,*/}
						{/*					fontFamily: 'Inter-Bold',*/}
						{/*					color: APP_FONT.MONTSERRAT_HEADER,*/}
						{/*				}}*/}
						{/*			>*/}
						{/*				Close*/}
						{/*			</Text>*/}
						{/*		</View>*/}
						{/*	</TouchableOpacity>*/}
						{/*</View>*/}
					</View>
				);
			}}
			drawerPosition={'right'}
		>
			{children}
		</Drawer>
	);
}

export default KnownServersDrawer;
