import { View, Text, StyleSheet } from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';
import { memo } from 'react';

type NoResultsProps = {
	text: string;
	subtext: string;
};

const NoResults = memo(({ text, subtext }: NoResultsProps) => {
	return (
		<View
			style={{
				display: 'flex',
				alignItems: 'center',
				marginTop: 32,
				padding: 16,
			}}
		>
			<View
				style={{
					borderWidth: 1,
					borderColor: '#ffffff60',
					padding: 16,
					borderRadius: 16,
					display: 'flex',
					alignItems: 'center',
					maxWidth: 360,
				}}
			>
				<Text
					style={{
						fontSize: 24,
						color: APP_FONT.MONTSERRAT_HEADER,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					}}
				>
					{text}
				</Text>
				<Text
					style={{
						fontSize: 16,
						textAlign: 'center',
						marginTop: 12,
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					{subtext}
				</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({});

export default NoResults;
