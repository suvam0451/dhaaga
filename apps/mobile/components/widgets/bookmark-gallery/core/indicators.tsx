import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { useBookmarkGalleryControllerContext } from '../../../../states/useBookmarkGalleryController';
import { UUID } from 'bson';
import { useMemo } from 'react';

type Props = {
	isSelected: boolean;
	onClick?: () => void;
};

const USER_SELECTION_BUBBLE_SIZE = 54;
const SELECTED_COLOR = APP_THEME.REPLY_THREAD_COLOR_SWATCH[1];

export function UserSelectionIndicator({
	_id,
	onClick,
	avatarUrl,
	count,
}: Props & { _id: UUID; avatarUrl: string; count: number }) {
	const {
		IsUserNoneSelected,
		IsUserAllSelected,
		isUserSelected,
		userStateHash,
	} = useBookmarkGalleryControllerContext();

	const isSelected = useMemo(() => {
		return isUserSelected(_id);
	}, [IsUserAllSelected, IsUserNoneSelected, userStateHash]);

	return (
		<View
			onTouchEnd={onClick}
			style={[
				styles.userSelectionBox,
				{
					borderColor: isSelected ? SELECTED_COLOR : 'gray',
				},
			]}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				source={avatarUrl}
				style={{
					flex: 1,
					width: '100%',
					borderRadius: 4,
					padding: 2,
				}}
			/>
			<View
				style={{
					position: 'absolute',
					zIndex: 99,
					right: '100%',
					bottom: 0,
					left: 0,
					backgroundColor: 'red',
				}}
			>
				<View
					style={{
						position: 'relative',
						width: '100%',
					}}
				>
					<View
						style={{
							position: 'absolute',
							left: -0,
							bottom: 0,
							display: 'flex',
							flexDirection: 'row',
							width: 52,
						}}
					>
						<View style={{ flexGrow: 1 }}></View>
						<View
							style={{
								backgroundColor: isSelected
									? SELECTED_COLOR
									: 'rgba(100,100, 100, 0.75)',
								borderRadius: 8,
								borderBottomRightRadius: 4,
								borderBottomLeftRadius: 0,
								borderTopRightRadius: 0,
								paddingHorizontal: 8,
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									color: isSelected
										? 'rgba(0, 0, 0, 0.6)'
										: APP_FONT.MONTSERRAT_HEADER,
									fontSize: 12,
									fontFamily: 'Inter-Bold',
								}}
							>
								{count}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

export function TagSelectionIndicator({ isSelected, onClick }: Props) {}

const base: ViewStyle = {
	height: USER_SELECTION_BUBBLE_SIZE,
	width: USER_SELECTION_BUBBLE_SIZE,
	marginRight: 8,
	position: 'relative',
	borderColor: 'gray',
	borderWidth: 2,
	borderRadius: 6,
};

const styles = StyleSheet.create({
	userSelectionBox: base,
	userSelectionBoxSpecial: {
		...base,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	//
	widgetContainerExpanded: {
		marginBottom: 8,
		backgroundColor: 'rgba(54,54,54,0.87)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		// maxWidth: 64,
		marginHorizontal: 8,
		padding: 8,
	},
	widgetContainerCollapsed: {
		marginBottom: 16,
		backgroundColor: 'rgba(54,54,54,0.87)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},

	// each tag item
	tagItemContainer: {
		// marginRight: 8,
		// backgroundColor: 'red',
		// borderRadius: 8,
		// padding: 8,
	},
	tagSelectionBoxSpecial: {
		backgroundColor: 'rgba(240,185,56,0.16)',
		margin: 4,
		padding: 4,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
	},
});
