import Svg, { Path } from 'react-native-svg';
import { useAppTheme } from '#/states/global/hooks';

function CurvedLine(props) {
	const { theme } = useAppTheme();
	return (
		<Svg width={20} height={30} xmlns="http://www.w3.org/2000/svg" {...props}>
			<Path
				stroke={props.color || theme.primary.a0}
				d="m1.07727,0.34416c-0.45023,13.04243 18.90974,18.82072 18.90974,18.73817"
				opacity="NaN"
				strokeWidth={2.5}
				fill="none"
			/>
		</Svg>
	);
}

export default CurvedLine;
