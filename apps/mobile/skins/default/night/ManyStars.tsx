// StarField.js
import React from 'react';
import { View, Dimensions } from 'react-native';
import Star from '../SingleStar';

function randomPositionAvoidCenter(width, height, radius = 120) {
	const cx = width / 2;
	const cy = height / 2;

	while (true) {
		const x = Math.random() * width;
		const y = Math.random() * height;

		const dx = x - cx;
		const dy = y - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);

		if (dist > radius) {
			return { x, y };
		}
	}
}

export default function StarField({ count = 50 }) {
	const { width, height } = Dimensions.get('window');
	const stars = Array.from({ length: count });

	return (
		<View
			style={{
				flex: 1,
				position: 'absolute',
				height: '100%',
				width: '100%',
			}}
		>
			{stars.map((_, i) => {
				const size = 3 + Math.random() * 6;
				const { x, y } = randomPositionAvoidCenter(width, height, 130); // adjust radius

				return (
					<View
						key={i}
						style={{
							position: 'absolute',
							top: y,
							left: x,
						}}
					>
						<Star size={size} />
					</View>
				);
			})}
		</View>
	);
}
