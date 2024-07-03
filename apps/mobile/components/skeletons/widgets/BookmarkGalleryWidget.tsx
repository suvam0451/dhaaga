import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@rneui/themed';

function BookmarkGalleryWidgetSkeleton() {
	return (
		<View
			style={{
				width: '100%',
				position: 'absolute',
				bottom: 0,
				right: 0,
			}}
		>
			<View style={styles.container}>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<View style={{ flexGrow: 1, height: 54, marginRight: 8 }}>
						<Skeleton style={styles.skeletonContainer} />
					</View>
					<View style={{ height: 54, width: 72 }}>
						<Skeleton style={styles.skeletonContainer} />
					</View>
				</View>
				<Skeleton
					style={{
						height: 64,
						borderRadius: 8,
						marginBottom: 16,
					}}
				/>

				<Skeleton
					style={{
						height: 48,
						borderRadius: 8,
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		marginBottom: 8,
		marginHorizontal: 8,
		padding: 8,
		display: 'flex',

		backgroundColor: 'rgba(54,54,54,0.87)',
	},
	skeletonContainer: {
		height: 36,
		width: '100%',
		borderRadius: 8,
		// backgroundColor: 'red',
	},
});

export default BookmarkGalleryWidgetSkeleton;
