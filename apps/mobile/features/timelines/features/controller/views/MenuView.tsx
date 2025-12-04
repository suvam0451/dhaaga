import { View } from 'react-native';
import { AppMenu } from '#/components/lib/Menu';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type Props = {
	onOpenInBrowser: () => void;
};

function MenuView({ onOpenInBrowser }: Props) {
	return (
		<View style={{ paddingHorizontal: 10 }}>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Open in Browser'}
				onPress={onOpenInBrowser}
				desc={'View in external browser'}
			/>

			{/*<AppDivider.Hard*/}
			{/*	style={{*/}
			{/*		marginHorizontal: 10,*/}
			{/*		marginVertical: 8,*/}
			{/*		backgroundColor: '#2c2c2c',*/}
			{/*	}}*/}
			{/*/>*/}

			{/*<AppMenu.Option*/}
			{/*	appIconId={*/}
			{/*		<AppIcon*/}
			{/*			id={'pin-octicons'}*/}
			{/*			emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
			{/*		/>*/}
			{/*	}*/}
			{/*	label={'Add Pin'}*/}
			{/*	onPress={() => {}}*/}
			{/*	desc={'Pin this timeline to the Social Hub'}*/}
			{/*/>*/}
			{/*<AppMenu.Option*/}
			{/*	appIconId={*/}
			{/*		<AppIcon id={'to-top'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />*/}
			{/*	}*/}
			{/*	label={'Scroll to Top'}*/}
			{/*	onPress={() => {}}*/}
			{/*/>*/}
			{/*<AppMenu.Option*/}
			{/*	appIconId={*/}
			{/*		<AppIcon*/}
			{/*			id={'layers-outline'}*/}
			{/*			emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
			{/*		/>*/}
			{/*	}*/}
			{/*	label={'Switch Timeline'}*/}
			{/*	onPress={() => {}}*/}
			{/*/>*/}
			{/*<AppMenu.Option*/}
			{/*	appIconId={*/}
			{/*		<AppIcon*/}
			{/*			id={'layers-outline'}*/}
			{/*			emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
			{/*		/>*/}
			{/*	}*/}
			{/*	label={'Switch Timeline'}*/}
			{/*	onPress={() => {}}*/}
			{/*/>*/}
		</View>
	);
}

export default MenuView;
