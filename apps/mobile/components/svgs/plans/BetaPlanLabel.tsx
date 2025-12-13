// @ts-nocheck
import * as React from 'react';
import Svg, { Defs, ClipPath, Path, G } from 'react-native-svg';
function SvgComponent(props) {
	const size = props.size ?? 682.667;
	const scale = size / 682.667;

	return (
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			xmlSpace="preserve"
			width={682.667 * scale}
			height={682.667 * scale}
			{...props}
		>
			<Defs>
				<ClipPath id="a" clipPathUnits="userSpaceOnUse">
					<Path d="M0 512h512V0H0Z" />
				</ClipPath>
			</Defs>
			<G
				scale={scale}
				clipPath="url(#a)"
				transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
			>
				<Path
					d="M0 0c-10.071 0-18.236 8.165-18.236 18.236 0 10.071 8.165 18.236 18.236 18.236 10.071 0 18.236-8.165 18.236-18.236C18.236 8.165 10.071 0 0 0m-291.063 0c-10.072 0-18.236 8.165-18.236 18.236 0 10.071 8.164 18.236 18.236 18.236 10.071 0 18.235-8.165 18.235-18.236C-272.828 8.165-280.992 0-291.063 0M81.621 69.82h-420.053c-2.607-1.221-4.599-2.186-4.599-2.186l-9.818-13.379v-300.5l5.818-9.75 11.094-6.001H81.621c11.79 0 21.348 9.559 21.348 21.349V48.472c0 11.79-9.558 21.348-21.348 21.348"
					style={{
						fill: '#ffd500',
						fillOpacity: 1,
						fillRule: 'nonzero',
						stroke: 'none',
					}}
					transform="translate(401.527 269.495)"
				/>
				<Path
					d="M0 0v289.119c0 11.791 9.558 21.349 21.349 21.349h-46.342c-11.79 0-21.348-9.558-21.348-21.349V0c0-11.79 9.558-21.348 21.348-21.348h46.342C9.558-21.348 0-11.79 0 0"
					style={{
						fill: '#fbc700',
						fillOpacity: 1,
						fillRule: 'nonzero',
						stroke: 'none',
					}}
					transform="translate(53.836 28.848)"
				/>
				<Path
					d="M0 0h-5.125l-10-13.301-.625-14.842L-11-39.676l5.25-2.625 5.75-.8c8.312 3.622 14.125 11.905 14.125 21.551C14.125-11.905 8.312-3.621 0 0"
					style={{
						fill: '#60b9fe',
						fillOpacity: 1,
						fillRule: 'nonzero',
						stroke: 'none',
					}}
					transform="translate(265.37 502.55)"
				/>
				<Path
					d="M0 0c0 9.645 5.813 17.929 14.125 21.55A23.407 23.407 0 0 1 4.75 23.5c-12.979 0-23.5-10.521-23.5-23.5s10.521-23.5 23.5-23.5c3.333 0 6.502.698 9.375 1.95C5.813-17.929 0-9.646 0 0"
					style={{
						fill: '#1ca8ff',
						fillOpacity: 1,
						fillRule: 'nonzero',
						stroke: 'none',
					}}
					transform="translate(251.246 481)"
				/>
				<Path
					d="m0 0-15.616-64.849L-33.834-2.82l-18.219-62.029L-67.668 0"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(123.853 228.164)"
				/>
				<Path
					d="M0 0c0-17.907-14.517-32.424-32.424-32.424-17.908 0-32.425 14.517-32.425 32.424 0 17.908 14.517 32.425 32.425 32.425C-14.517 32.425 0 17.908 0 0Z"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(205.576 195.739)"
				/>
				<Path
					d="M0 0h16.104c8.954 0 16.212 7.259 16.212 16.212 0 8.954-7.258 16.213-16.212 16.213H-3.232v-64.849"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(230.229 195.739)"
				/>
				<Path
					d="m0 0-24.516 31.778"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(261.913 163.315)"
				/>
				<Path
					d="M0 0v64.849L42.534 0v64.849"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(413.281 163.315)"
				/>
				<Path
					d="M0 0v-64.849"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(381.26 228.164)"
				/>
				<Path
					d="M0 0h-21.351v54.564H0"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(350.72 62.027)"
				/>
				<Path
					d="M0 0h-19.718"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(349.533 89.31)"
				/>
				<Path
					d="M0 0c0-15.067-12.215-27.282-27.282-27.282-15.068 0-27.282 12.215-27.282 27.282s12.214 27.282 27.282 27.282C-12.215 27.282 0 15.067 0 0Z"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(206.586 89.31)"
				/>
				<Path
					d="M0 0h13.551c7.533 0 13.64 6.107 13.64 13.641s-6.107 13.641-13.64 13.641h-16.27v-54.564"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(107.86 89.31)"
				/>
				<Path
					d="m0 0-20.628 26.738"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(134.52 62.027)"
				/>
				<Path
					d="M0 0h13.55c7.534 0 13.641 6.107 13.641 13.641S21.084 27.282 13.55 27.282H-2.719v-54.564"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(280.873 89.31)"
				/>
				<Path
					d="m0 0-20.628 26.738"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(307.532 62.027)"
				/>
				<Path
					d="M0 0h13.551c7.533 0 13.64 6.107 13.64 13.641s-6.107 13.641-13.64 13.641h-16.27v-54.564"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(58.904 89.31)"
				/>
				<Path
					d="M0 0s-6.418 6.665-15.059 6.665c-8.639 0-14.934-6.295-14.934-12.775s8.146-11.664 18.452-14.379C-1.234-23.205.946-28.533.946-34.21c0-5.678-5.019-13.001-16.786-13.001-11.767 0-17.033 8.557-17.033 8.557"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(402.283 109.582)"
				/>
				<Path
					d="M0 0s-6.418 6.665-15.058 6.665S-29.993.37-29.993-6.11s8.146-11.664 18.452-14.379C-1.234-23.205.946-28.533.946-34.21c0-5.678-5.019-13.001-16.786-13.001-11.767 0-17.033 8.557-17.033 8.557"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(454.869 109.582)"
				/>
				<Path
					d="M0 0c-1.788 6.603-7.822 11.46-14.99 11.46-8.576 0-15.529-6.952-15.529-15.528v-23.507c0-8.576 6.953-15.529 15.529-15.529S.538-36.151.538-27.575v7.35h-9.494"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(255.121 105.13)"
				/>
				<Path
					d="M0 0v-64.849"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(284.482 228.164)"
				/>
				<Path
					d="m0 0-31.986-32.425"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(320.2 228.164)"
				/>
				<Path
					d="m0 0-31.986 32.424"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(320.2 163.315)"
				/>
				<Path
					d="M0 0c-12.979 0-23.5-10.521-23.5-23.5S-12.979-47 0-47s23.5 10.521 23.5 23.5S12.979 0 0 0Z"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(256 504.5)"
				/>
				<Path
					d="m0 0-118.486-154.928"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(242.34 460.161)"
				/>
				<Path
					d="m0 0 120.455-157.502"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(269.277 460.662)"
				/>
				<Path
					d="M0 0c-10.071 0-18.236 8.165-18.236 18.236 0 10.071 8.165 18.236 18.236 18.236 10.071 0 18.236-8.165 18.236-18.236C18.236 8.165 10.071 0 0 0Zm-291.063 0c-10.072 0-18.236 8.165-18.236 18.236 0 10.071 8.164 18.236 18.236 18.236 10.071 0 18.235-8.165 18.235-18.236C-272.828 8.165-280.992 0-291.063 0Zm128.031 69.82h-209.652c-11.79 0-21.348-9.558-21.348-21.348v-289.119c0-11.79 9.558-21.349 21.348-21.349H81.621c11.79 0 21.348 9.559 21.348 21.349v122.202m0 35V48.472c0 11.79-9.558 21.348-21.348 21.348h-209.653"
					style={{
						fill: 'none',
						stroke: '#000',
						strokeWidth: 15,
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeMiterlimit: 10,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					transform="translate(401.532 269.495)"
				/>
			</G>
		</Svg>
	);
}

export default SvgComponent;
