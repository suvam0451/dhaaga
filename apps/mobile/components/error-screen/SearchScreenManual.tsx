import {
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';
import { router } from 'expo-router';
import { APP_FONTS } from '../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';

type InternalLinkProps = {
	label: string;
	to: string;
	style?: StyleProp<ViewStyle>;
};

const InternalLink = memo(({ label, to, style }: InternalLinkProps) => {
	return (
		<TouchableOpacity
			onPress={() => {
				router.navigate(to);
			}}
		>
			<View style={style}>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					}}
				>
					{label}
				</Text>
				<Ionicons
					size={24}
					color={APP_FONT.MONTSERRAT_BODY}
					name={'chevron-forward'}
				/>
			</View>
		</TouchableOpacity>
	);
});

function SearchScreenManual() {
	return (
		<View style={styles.manualContainer}>
			<View style={styles.borderContainer}>
				<Text
					style={{
						opacity: 0.87,
						fontSize: 20,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					⌨️ to get started
				</Text>
				<View style={{ width: '100%', display: 'flex', marginVertical: 16 }}>
					<Text
						style={{
							textAlign: 'center',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{' '}
						--- OR ---{' '}
					</Text>
				</View>

				<View style={{ minWidth: '100%' }}>
					<InternalLink
						to={'/discover/trending-posts'}
						label={'Trending Posts'}
						style={[
							styles.linkSectionContainer,
							{
								borderTopLeftRadius: 8,
								borderTopRightRadius: 8,
								borderBottomWidth: 1.5,
							},
						]}
					/>
					<InternalLink
						to={'/discover/trending-tags'}
						label={'Trending Tags'}
						style={[styles.linkSectionContainer]}
					/>
					<InternalLink
						to={'/discover/trending-links'}
						label={'Trending Links'}
						style={[
							styles.linkSectionContainer,
							{
								borderBottomStartRadius: 8,
								borderBottomEndRadius: 8,
								borderTopWidth: 1.5,
							},
						]}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	manualContainer: {
		alignItems: 'center',
		padding: 16,
	},
	borderContainer: {
		borderWidth: 1,
		borderColor: APP_FONT.DISABLED,
		padding: 16,
		borderRadius: 16,
		alignItems: 'center',
		width: '100%',
	},
	linkSectionContainer: {
		backgroundColor: '#232323',
		paddingHorizontal: 8,
		paddingVertical: 6,
		alignItems: 'center',
		flexDirection: 'row',
		borderColor: '#ffffff30',
		justifyContent: 'space-between',
	},
});

export default SearchScreenManual;
