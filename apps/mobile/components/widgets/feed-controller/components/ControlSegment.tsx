import { ScrollView, View, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../lib/Text';

type Props = {
	label?: string;
	buttons: {
		lookupId: string;
		label: string;
		onClick: () => void;
	}[];
	selection: Set<string>;
	hash: string;
	activeForeground?: string;
	activeBackground?: string;
	inactiveForeground?: string;
	inactiveBackground?: string;
};

function ControlSegment({
	label,
	buttons,
	selection,
	activeForeground,
	activeBackground,
	inactiveForeground,
	inactiveBackground,
}: Props) {
	const { theme } = useAppTheme();

	const _activeForeground = activeForeground || 'black';
	const _activeBackground = activeBackground || theme.primary.a0;
	const _inactiveForeground = inactiveForeground || theme.secondary.a20;
	const _inactiveBackground = inactiveBackground || '#2c2c2c';

	return (
		<View style={{ marginTop: 16, overflow: 'scroll' }}>
			{label && (
				<AppText.Medium
					style={{
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						color: theme.secondary.a10,
						marginBottom: 12,
					}}
				>
					{label}
				</AppText.Medium>
			)}
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					{buttons.map((o, i) => (
						<View
							key={i}
							style={{
								borderRadius: 8,
								backgroundColor: selection.has(o.lookupId)
									? _activeBackground
									: _inactiveBackground,
								padding: 8,
								marginRight: 8,
							}}
							onTouchEnd={o.onClick}
						>
							<Text
								style={{
									color: selection.has(o.lookupId)
										? _activeForeground
										: _inactiveForeground,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
									paddingHorizontal: 8,
								}}
							>
								{o.label}
							</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

export default ControlSegment;
