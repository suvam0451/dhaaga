import { memo } from 'react';
import { View } from 'react-native';
import { styles } from '../fab.styles';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';

type FabMenuItemIconProps = {
	Icon: React.JSX.Element;
};

/**
 * The icon container portion
 * of a fab menu item
 */
export const FabMenuItemIcon = memo(function Foo({
	Icon,
}: FabMenuItemIconProps) {
	return (
		<View style={styles.widgetContainerCollapsedCButton}>
			<View
				style={[
					{
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						justifyContent: 'center',
						padding: 12,
						paddingVertical: 16,
					},
				]}
			>
				<View style={[{ width: 24 }]}>{Icon}</View>
			</View>
		</View>
	);
});

type FabMenuItemTextProps = {
	label: string;
};

export const FabMenuItemText = memo(function Foo({
	label,
}: FabMenuItemTextProps) {
	return (
		<View
			style={{
				marginRight: 8,
				backgroundColor: 'rgba(54,54,54,0.87)',
				padding: 8,
				borderRadius: 8,
			}}
		>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
				}}
				numberOfLines={1}
			>
				{label}
			</Text>
		</View>
	);
});
