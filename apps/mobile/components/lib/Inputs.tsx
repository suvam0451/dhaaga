import { APP_FONT } from '../../styles/AppTheme';
import { Input } from '@rneui/themed';
import { useMemo, useRef, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
	TextInput,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
	multiline?: boolean;
	onChangeText?: React.Dispatch<React.SetStateAction<string>>;
	placeholder?: string;
};

/**
 * rneui Input component adapted to
 * our app theme
 * @param props
 * @constructor
 */
function AppInput(props: Props) {
	return (
		<Input
			// @ts-ignore
			multiline={props?.multiline || false}
			placeholder={props?.placeholder || ''}
			containerStyle={{
				borderBottomWidth: 0,
				paddingBottom: 0,
				marginBottom: -16,
			}}
			onChangeText={props.onChangeText}
			inputContainerStyle={{
				borderBottomWidth: 0,
			}}
			inputStyle={{
				paddingHorizontal: 16,
				color: '#fff',
			}}
			style={{
				color: APP_FONT.MONTSERRAT_HEADER,
				fontSize: 16,
				opacity: 0.87,
				marginHorizontal: -8,
				backgroundColor: '#363636',
			}}
			labelStyle={{
				color: '#fff',
			}}
		/>
	);
}

type AppInputSimpleSearchProps = {
	placeholder: string;
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	IsLoading: boolean;
};

/**
 * Uses the core react-native input
 * component
 * @param placeholder
 * @param value
 * @param IsLoading
 * @param setValue
 * @constructor
 */
export function AppInputSimpleSearch({
	placeholder,
	value,
	IsLoading,
	setValue,
}: AppInputSimpleSearchProps) {
	const valueRef = useRef<string>('');
	const inputRef = useRef(null);

	function onInputClear() {
		setValue('');
	}

	function onInputChange(e: any) {
		setValue(e);
	}

	const RightIcon = useMemo(() => {
		if (IsLoading) {
			return (
				<View
					style={{
						width: 24,
						height: 24,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator size={24} />
				</View>
			);
		}

		return (
			<TouchableOpacity
				onPressIn={onInputClear}
				style={styles.rightButtonClickableArea}
			>
				<View
					style={{
						width: 24,
						height: 24,
					}}
				>
					<MaterialIcons
						name="close"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
						opacity={value === '' ? 0.5 : 1}
					/>
				</View>
			</TouchableOpacity>
		);
	}, [IsLoading, value]);

	return (
		<View
			style={{
				minWidth: '100%',
				display: 'flex',
				flexDirection: 'row',
				maxWidth: '100%',
				alignItems: 'center',
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<TextInput
					ref={inputRef}
					style={{
						textDecorationLine: 'none',
						textDecorationStyle: undefined,
						width: '100%',
						height: 48,
						paddingVertical: 16,
						paddingLeft: 16,
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 16,
						paddingBottom: 13,
					}}
					value={value}
					onChangeText={onInputChange}
					keyboardType={'visible-password'}
					placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
					placeholder={placeholder}
					autoCapitalize={'none'}
				/>
			</View>
			<View>{RightIcon}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		fontSize: 16,
		borderRadius: 8,
		paddingLeft: 8,
		marginBottom: -24,
		lineHeight: 24,
		backgroundColor: '#363636',
		textDecorationLine: 'none',
		display: 'flex',
		alignItems: 'center',
	},
	inputStyle: {
		textDecorationLine: 'none',
		color: APP_FONT.MONTSERRAT_HEADER,
	},
	// apply negative padding to ensure good clicks
	rightButtonClickableArea: {
		marginTop: -10,
		paddingTop: 10,
		marginBottom: -8,
		paddingBottom: 8,
		paddingLeft: 12,
		marginLeft: -12,
		paddingRight: 12,
		marginRight: 0,
		// backgroundColor: 'blue',
	},
	inputContainerStyle: {
		paddingLeft: 8,
		borderBottomWidth: 0,
		marginLeft: -16,
	},
	rightIconContainerStyle: {
		marginBottom: -24,
	},
});

export default AppInput;
