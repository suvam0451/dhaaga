import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { View, Text, TouchableOpacity } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { router } from 'expo-router';

function TrendingLinksStack() {
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		loadNextPage: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={'Trending Links'} translateY={translateY}>
			<View
				style={{
					marginTop: 54,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						width: '100%',
						borderWidth: 1,
						borderColor: 'gray',
						maxWidth: 345,
						borderRadius: 8,
						padding: 16,
						marginTop: 32,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_HEADER,
							textAlign: 'center',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
						}}
					>
						This page has not been implemented
					</Text>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_HEADER,
							textAlign: 'center',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							marginTop: 12,
						}}
					>
						{' '}
						I apologize for the inconvenience 🥲
					</Text>

					<TouchableOpacity
						style={{
							backgroundColor: '#242424',
							marginTop: 24,
							padding: 8,
							borderRadius: 8,
						}}
						onPress={router.back}
					>
						<Text
							style={{
								fontSize: 20,
								color: APP_FONT.MONTSERRAT_HEADER,
								textAlign: 'center',
							}}
						>
							Go Back
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</WithAutoHideTopNavBar>
	);
}

export default TrendingLinksStack;
