// @ts-nocheck
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
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
				d="M383.702 457.642c4.004 11.001 16.168 16.673 27.169 12.669 11.001-4.004 16.673-16.168 12.669-27.169"
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
				d="m407.686 399.585 15.854 43.557c4.004 11.001 16.168 16.673 27.169 12.669 11.001-4.004 16.673-16.168 12.669-27.169M487.361 370.586l-159.346 57.997M287.002 315.901l159.346-57.997M464.61 308.078l-159.347 57.997M128.298 457.642c-4.004 11.001-16.168 16.673-27.169 12.669-11.001-4.004-16.673-16.168-12.669-27.169M104.313 399.585 88.46 443.142c-4.004 11.001-16.168 16.673-27.169 12.669-11.001-4.004-16.673-16.168-12.669-27.169"
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
				d="M90.719 189.03 8.784 414.143c-4.004 11.001 1.668 23.165 12.669 27.169 11.001 4.004 23.165-1.668 27.169-12.669l15.853-43.557 79.676 29-15.854 43.557c-4.004 11.001 1.668 23.165 12.669 27.169 11.001 4.004 23.165-1.668 27.169-12.669l92.386-253.837M24.639 370.586l159.346 57.997M224.998 315.901 65.652 257.904M47.39 308.078l159.346 57.997"
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
				d="m86.008 50.847-36.942 75.286c-8.909 18.156-2.061 40.028 15.507 50.046 99.619 56.806 281.279 56.231 384.126-1.725 16.829-9.484 24.011-29.972 16.656-47.835l-31.123-75.587c-8.096-19.663-30.005-29.745-50.197-23.076-80.493 26.584-167.525 29.828-248.37 2.419-19.385-6.571-40.64 2.096-49.657 20.472z"
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
				d="m256.002 230.735 87.862 241.407c4.004 11.001 16.168 16.673 27.169 12.669s16.673-16.168 12.669-27.169l-15.854-43.557 79.676-29 15.854 43.557c4.004 11.001 16.168 16.673 27.169 12.669 11.001-4.004 16.673-16.168 12.669-27.169L420.898 187.98M194.25 104.191v12M319.147 104.191v12M240.234 115.834c4.003 4.594 9.892 7.501 16.464 7.501 6.572 0 12.461-2.907 16.464-7.501"
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
