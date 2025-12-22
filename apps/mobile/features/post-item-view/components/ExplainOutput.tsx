import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';
import { useAppTheme } from '#/states/global/hooks';

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
	const { theme } = useAppTheme();
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
						<NativeTextBold
							style={{
								color: 'rgba(187,134,252,0.87)',
							}}
						>
							{` ${fromLang} -> ${toLang}`}
						</NativeTextBold>
					</View>
				</View>
				<View>
					<NativeTextBold
						style={{
							color: theme.secondary.a20,
							textAlign: 'right',
							fontSize: 13,
						}}
					>
						{additionalInfo}
					</NativeTextBold>
				</View>
			</View>
			<NativeTextNormal
				style={{
					color: theme.secondary.a20,
				}}
			>
				{text}
			</NativeTextNormal>
		</View>
	);
}

export default ExplainOutput;
