import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	fromLang: string;
	toLang: string;
	additionalInfo: string;
	text: string;
};

/**
 * Container for the translation output
 * @param text
 * @param fromLang
 * @param toLang
 * @param additionalInfo
 * @constructor
 */
function ExplainOutput({ text, fromLang, toLang, additionalInfo }: Props) {
	return (
		<View
			style={{
				backgroundColor: '#2a2a2a',
				paddingLeft: 8,
				paddingRight: 8,
				paddingTop: 4,
				paddingBottom: 4,
				marginTop: 8,
				borderRadius: 8,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					marginBottom: 4,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexGrow: 1,
						alignItems: 'center',
					}}
				>
					<View>
						<Ionicons color={'#bb86fc'} name={'language-outline'} size={15} />
					</View>
					<View>
						<Text
							style={{
								color: 'rgba(187,134,252,0.87)',
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							{` ${fromLang} -> ${toLang}`}
						</Text>
					</View>
				</View>
				<View>
					<Text
						style={{
							color: APP_FONT.DISABLED,
							textAlign: 'right',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 13,
						}}
					>
						{additionalInfo}
					</Text>
				</View>
			</View>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.INTER_400_REGULAR,
				}}
			>
				{text}
			</Text>
		</View>
	);
}

export default ExplainOutput;
