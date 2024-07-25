import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../../styles/AppFonts';

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
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					}}
				>
					{label}
				</Text>
			</View>
		</View>
	);
}

export default DefaultPinnedItem;
