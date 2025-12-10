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
				d="m242.95 76.45-28.128-40.058c-15.533-22.12-49.186-19.131-60.577 5.381l-9.476 20.393"
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
				d="m211.171 100.502-73.747-42.578c-31.556-18.219-71 4.555-71 40.992v37.814M367.231 62.165l-9.476-20.393c-11.39-24.512-45.044-27.501-60.577-5.381L269.05 76.45"
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
				d="M445.577 136.73V98.916c0-36.437-39.445-59.211-71-40.992l-73.747 42.578M188.661 490.546V136.73M323.339 136.73v353.816"
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
				d="M107.576 136.73H47.447c-22.062 0-39.947 17.885-39.947 39.947v50.187c0 22.062 17.885 39.947 39.947 39.947h417.106c22.062 0 39.947-17.885 39.947-39.947v-50.187c0-22.062-17.885-39.947-39.947-39.947H142.576M461.129 366.025v-99.214M50.871 266.811v153.855c0 38.594 31.286 69.88 69.88 69.88h270.498c38.594 0 69.88-31.286 69.88-69.88v-19.641"
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
				d="M306.984 136.73c.629-3.232.968-6.567.968-9.982 0-28.692-23.26-51.952-51.952-51.952-28.692 0-51.952 23.26-51.952 51.952 0 3.416.339 6.751.968 9.982"
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
