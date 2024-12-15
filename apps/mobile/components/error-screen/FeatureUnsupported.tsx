import { View, Text } from 'react-native';
import { memo } from 'react';
import { APP_FONTS } from '../../styles/AppFonts';
import { APP_FONT } from '../../styles/AppTheme';
import SimpleSoftwareBadge from '../common/software/SimpleBadge';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const FeatureUnsupported = memo(() => {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);

	return (
		<View
			style={{
				padding: 16,
				paddingTop: 54 + 32,
			}}
		>
			<View
				style={{
					padding: 16,
					backgroundColor: '#202020',
					alignItems: 'center',
					borderRadius: 8,
				}}
			>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_700_BOLD,
						fontSize: 16,
						textAlign: 'center',
						marginHorizontal: 32,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					Your instance software does not support this feature.
				</Text>
				<View style={{ marginTop: 16 }}>
					<SimpleSoftwareBadge software={driver} />
				</View>
			</View>
		</View>
	);
});

export default FeatureUnsupported;
