import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';

type Props = {
	label: string;
	buttons: {
		selected: boolean;
		label: string;
		onClick: () => void;
	}[];
};

function ControlSegment({ label, buttons }: Props) {
	return (
		<View style={{ marginTop: 16 }}>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					marginBottom: 4,
				}}
			>
				{label}
			</Text>
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				{buttons.map((o, i) => (
					<View
						key={i}
						style={{
							borderRadius: 8,
							backgroundColor: o.selected
								? 'rgba(170, 170, 170, 0.87)'
								: '#1e1e1e',
							padding: 8,
							marginRight: 8,
						}}
					>
						<Text
							style={{
								color: o.selected
									? 'rgba(0, 0, 0, 1)'
									: APP_FONT.MONTSERRAT_BODY,
								fontFamily: 'Montserrat-Bold',
							}}
						>
							{o.label}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

export default ControlSegment;
