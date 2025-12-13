import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
function SvgComponent(props) {
	const size = props.size ?? 512;
	const scale = size / 512;
	const color = props.color ?? 'white';

	return (
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width={512 * scale}
			height={512 * scale}
			viewBox="0 0 64 64"
			{...props}
		>
			<Path
				fill="#ffb125"
				d="M31.92 18a3.978 3.978 0 0 1-3.12-1.5L24.4 11H59a4.004 4.004 0 0 1 4 4v3z"
			/>
			<Path
				fill="#fcd354"
				d="M5 56a4.004 4.004 0 0 1-4-4V12a4.004 4.004 0 0 1 4-4h14.12a5.975 5.975 0 0 1 4.68 2.25l5.001 6.251A3.975 3.975 0 0 0 31.92 18H63v34a4.004 4.004 0 0 1-4 4z"
			/>
			<Path
				fill="#202023"
				d="M64 15v37a5.006 5.006 0 0 1-5 5H5a5.006 5.006 0 0 1-5-5V12a5.006 5.006 0 0 1 5-5h14.116a6.966 6.966 0 0 1 5.466 2.627l4.998 6.247A2.986 2.986 0 0 0 31.922 17H59a1 1 0 0 1 0 2H31.922a4.977 4.977 0 0 1-3.904-1.876l-4.998-6.247A4.973 4.973 0 0 0 19.116 9H5a3.003 3.003 0 0 0-3 3v40a3.003 3.003 0 0 0 3 3h54a3.003 3.003 0 0 0 3-3V15a3.003 3.003 0 0 0-3-3H30a1 1 0 0 1 0-2h29a5.006 5.006 0 0 1 5 5z"
			/>
		</Svg>
	);
}
export default SvgComponent;
