import Svg, { Rect, Pattern, Defs } from 'react-native-svg';

export default function CandyCaneLine({ width = 4, height = 100 }) {
	return (
		<Svg width={width} height={height}>
			<Defs>
				<Pattern
					id="candy"
					patternUnits="userSpaceOnUse"
					width="10"
					height="10"
					patternTransform="rotate(45)"
				>
					<Rect width="10" height="10" fill="#fff" />
					<Rect width="5" height="10" fill="#ff0000" />
				</Pattern>
			</Defs>
			<Rect width={width} height={height} fill="url(#candy)" />
		</Svg>
	);
}
