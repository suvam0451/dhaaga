import { View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_THEME } from '../../../../styles/AppTheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';

/**
 * @param index is the currently active page index
 */
function tabBarRenderer(index: number) {
	return (props: any) => {
		const routes: {
			key: string;
			title: string;
		}[] = props.navigationState.routes;
		return (
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					backgroundColor: '#555',
					borderRadius: 8,
					paddingHorizontal: 8,
				}}
			>
				{routes.map((o, i) => {
					switch (i) {
						case 0:
							return (
								<View key={i} style={styles.dialogButtonGroupItem}>
									<View style={{ width: 24 }}>
										<AntDesign
											name="pushpin"
											size={24}
											color={index === 0 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</View>
							);
						case 1:
							return (
								<View style={styles.dialogButtonGroupItem} key={i}>
									<View style={{ width: 24 }}>
										<FontAwesome5
											name="list"
											size={24}
											color={index === 1 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</View>
							);

						case 2:
							return (
								<View style={styles.dialogButtonGroupItem} key={i}>
									<View style={{ width: 24 }}>
										<FontAwesome6
											name="hashtag"
											size={24}
											color={index === 2 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</View>
							);

						case 3:
							return (
								<View style={styles.dialogButtonGroupItem} key={i}>
									<View style={{ width: 24 }}>
										<FontAwesome5
											name="user-alt"
											size={24}
											color={index === 3 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</View>
							);
						case 4:
							return (
								<View style={styles.dialogButtonGroupItem} key={i}>
									<View style={{ width: 24 }}>
										<MaterialIcons
											name="dashboard-customize"
											size={24}
											color={index === 4 ? APP_THEME.LINK : '#888'}
										/>
									</View>
								</View>
							);
					}
				})}
			</View>
		);
	};
}

export default tabBarRenderer;

const styles = StyleSheet.create({
	dialogButtonGroupItem: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 8,
		paddingVertical: 0,
	},
});
