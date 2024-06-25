import { View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../styles/AppFonts';
import React from 'react';

const ICON_SIZE = 20;

type Props = {
	label: string;
	Icon: any;
	disabled?: boolean;
	onClick: () => void;
};

function DefaultPinnedItem({ label, Icon, disabled, onClick }: Props) {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: 10,
				paddingLeft: 4,
				opacity: disabled ? 0.3 : 1,
			}}
			onTouchEnd={onClick}
		>
			<View style={{ width: 32 }}>{Icon}</View>
			<View>
				<Text
					style={{
						fontSize: 16,
						fontFamily: APP_FONTS.HEADER_BOLD,
					}}
				>
					{label}
				</Text>
			</View>
		</View>
	);
}

export default DefaultPinnedItem;
