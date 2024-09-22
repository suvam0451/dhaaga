import { memo } from 'react';
import { View, Text, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { formatDistanceToNowStrict } from 'date-fns';

type StatusCreatedAtProps = {
	from: Date;
	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
};

/**
 * A createdAt component,
 * that updates itself every second
 */
const StatusCreatedAt = memo(
	({ from, containerStyle, textStyle }: StatusCreatedAtProps) => {
		if (!from) return <View />;
		return (
			<View style={containerStyle}>
				<Text style={textStyle}>
					{formatDistanceToNowStrict(from, {
						addSuffix: false,
					})
						.replace('about ', '')
						.replace(/ years?/, 'y')
						.replace(/ months?/, 'm')
						.replace(/ weeks?/, 'w')
						.replace(/ days?/, 'd')
						.replace(/ hours?/, 'h')
						.replace(/ minutes?/, 'm')
						.replace(/ seconds?/, 's')}
				</Text>
			</View>
		);
	},
);

export default StatusCreatedAt;
