import { useLocalSearchParams } from 'expo-router';
import { Text } from '@rneui/themed';

export default function Route() {
	const { user } = useLocalSearchParams<{ user: string }>();

	return <Text>User: {user}</Text>;
}
