// @ts-nocheck
import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
function SvgComponent(props) {
	const color = props.color ?? '#000';
	return (
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			xmlSpace="preserve"
			style={{
				enableBackground: 'new 0 0 512 512',
			}}
			viewBox="0 0 512 512"
			{...props}
		>
			<Path
				d="M233.943 364.424 55.591 271.746c-16.128-8.381-35.996-2.1-44.377 14.028s-2.1 35.996 14.028 44.377l184.042 95.635M127.949 191.861c-10.898 9.108-20.214 20.474-27.172 33.865L72.34 280.449M202.506 272.034c-.814 18.718 3.12 37.896 12.38 55.715l28.437 54.724M439.66 280.449l-28.437-54.724a110.256 110.256 0 0 0-27.185-33.852"
				style={{
					fill: 'none',
					stroke: color,
					strokeWidth: 15,
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeMiterlimit: 10,
				}}
			/>
			<Circle
				cx={256}
				cy={130.322}
				r={44.784}
				style={{
					fill: 'none',
					stroke: color,
					strokeWidth: 15,
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeMiterlimit: 10,
				}}
			/>
			<Path
				d="m287.597 359.466-61.024 31.71c-16.128 8.381-22.409 28.249-14.028 44.377 8.381 16.128 28.249 22.409 44.377 14.028L486.757 330.15c16.128-8.381 22.409-28.249 14.028-44.377-8.381-16.128-28.249-22.409-44.377-14.028l-137.754 71.582M330.567 411.314c10.2 25.291 40.618 36.458 64.758 23.747 24.277-12.447 32.622-43.76 17.789-66.641M98.886 368.419c-14.833 22.883-6.488 54.194 17.789 66.641 24.139 12.712 54.559 1.543 64.758-23.747M114.863 139.183v23.397c0 30.254 32.751 49.164 58.953 34.036l54.237-31.314M228.052 95.342l-54.237-31.313c-26.201-15.127-58.953 3.782-58.953 34.036v6.118M283.948 165.302l54.237 31.314c26.201 15.127 58.953-3.782 58.953-34.036V98.065c0-30.255-32.751-49.164-58.953-34.036l-54.237 31.313"
				style={{
					fill: 'none',
					stroke: color,
					strokeWidth: 15,
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeMiterlimit: 10,
				}}
			/>
			<Path
				d="m145.335 200.89-14.067 34.981c-3.973 9.881 6.526 19.354 15.948 14.388l28.439-14.99 10.145 30.505c3.361 10.106 17.495 10.539 21.469.658l37.317-92.8M267.415 173.633l37.317 92.8c3.974 9.881 18.108 9.448 21.469-.658l10.145-30.505 28.439 14.99c9.422 4.966 19.921-4.507 15.948-14.388l-14.067-34.981"
				style={{
					fill: 'none',
					stroke: color,
					strokeWidth: 15,
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeMiterlimit: 10,
				}}
			/>
		</Svg>
	);
}
export default SvgComponent;
