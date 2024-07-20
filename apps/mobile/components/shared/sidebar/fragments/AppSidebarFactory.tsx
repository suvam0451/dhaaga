import { memo, useMemo } from 'react';
import * as React from 'react';
import { View } from 'react-native';
import Coffee from '../../../static/sponsorship/Coffee';
import VersionCode from '../../../static/sponsorship/VersionCode';
import { useAppDrawerContext } from '../../../../states/useAppDrawer';
import { Drawer } from 'react-native-drawer-layout';
import { APP_SIDEBAR_BG_COLOR, APP_SIDEBAR_PADDING } from '../sidebar.settings';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import Ionicons from '@expo/vector-icons/Ionicons';

type AppSidebarFactoryProps = {
	PageActions: React.JSX.Element;
	children: React.ReactNode;
};

const AppSidebarFactory = memo(function Foo({
	PageActions,
	children,
}: AppSidebarFactoryProps) {
	const { primaryAcct } = useActivityPubRestClientContext();

	const { open, setOpen } = useAppDrawerContext();
	const ProfileInfo = useMemo(() => {
		if (primaryAcct) {
			return (
				<View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginTop: 8,
							alignItems: 'center',
						}}
					>
						<View style={{ width: 48, height: 48 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								source={primaryAcct.avatarUrl}
								style={{ width: 48, height: 48 }}
							/>
						</View>
						<View style={{ flexGrow: 1 }}>
							{/*<Text>{primaryAcct.secrets}</Text>*/}
							<Text
								style={{
									fontFamily: 'Montserrat-Bold',
									color: APP_FONT.MONTSERRAT_HEADER,
								}}
							>
								@{primaryAcct.username}
							</Text>
							<Text
								style={{
									fontFamily: 'Montserrat-Bold',
									color: APP_FONT.MONTSERRAT_BODY,
									fontSize: 14,
								}}
							>
								{primaryAcct.subdomain}
							</Text>
						</View>
						<View
							style={{
								borderWidth: 1,
								borderColor: 'rgba(120, 120, 120, 0.5)',
								padding: 8,
								borderRadius: 8,
							}}
						>
							<Ionicons
								name="swap-horizontal"
								size={24}
								color={APP_FONT.MONTSERRAT_HEADER}
							/>
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
			drawerPosition={'right'}
			renderDrawerContent={() => (
				<View
					style={{
						backgroundColor: APP_SIDEBAR_BG_COLOR,
						padding: APP_SIDEBAR_PADDING,
						paddingBottom: 8,
						height: '100%',
						paddingTop: 32,
					}}
				>
					{/*<View>*/}
					{/*	<MaterialIcons*/}
					{/*		name="close"*/}
					{/*		size={24}*/}
					{/*		color={APP_FONT.MONTSERRAT_HEADER}*/}
					{/*		onPress={() => {*/}
					{/*			setOpen(false);*/}
					{/*		}}*/}
					{/*	/>*/}
					{/*</View>*/}
					{ProfileInfo}

					<View
						style={{
							width: '100%',
							height: 0.5,
							marginVertical: 16,
							backgroundColor: 'rgba(100, 100, 100, 1)',
						}}
					/>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						Profile:{' '}
						<Text
							style={{
								fontFamily: 'Montserrat-Bold',
								color: APP_THEME.COLOR_SCHEME_D_NORMAL,
							}}
						>
							Default
						</Text>
					</Text>
					<Text
						style={{
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						All settings are placeholders !
					</Text>

					<View
						style={{
							width: '100%',
							height: 0.5,
							marginVertical: 16,
							backgroundColor: 'rgba(100, 100, 100, 1)',
						}}
					></View>
					<View style={{ flexGrow: 1 }}>{PageActions}</View>
					<View>
						<Coffee />
						<VersionCode />
					</View>
				</View>
			)}
		>
			{children}
		</Drawer>
	);
});

export default AppSidebarFactory;
