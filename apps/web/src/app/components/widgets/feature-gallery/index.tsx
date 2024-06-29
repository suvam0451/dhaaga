import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';

enum KEY_FEATURES {
	BETTER_TIMELINES = 'presentation/better-timeline',
}

const data: Record<
	KEY_FEATURES,
	{
		title: string;
		subtitle: string;
		why: string;
		cards: {
			solution: string;
		}[];
	}
> = {
	[KEY_FEATURES.BETTER_TIMELINES]: {
		title: 'Better Timelines',
		subtitle: 'Designed for best media viewing experience',
		why: 'A refreshing timeline browsing experience',
		cards: [
			{
				solution: 'Images are never cropped.',
			},
		],
	},
};

function FeatureGalleryWidget() {
	const [SelectedFeature, setSelectedFeature] = useState<KEY_FEATURES>(
		KEY_FEATURES.BETTER_TIMELINES,
	);
	const [FeatureGalleryIndex, setFeatureGalleryIndex] = useState(0);

	useEffect(() => {
		setFeatureGalleryIndex(0);
	}, [SelectedFeature]);

	return (
		<Box>
			<p
				style={{
					fontSize: 48,
					fontWeight: 500,
					marginBottom: 48,
					textAlign: 'center',
				}}
			>
				Bringing innovation to the Fediverse
			</p>
			<Box
				style={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box>
					<Box style={{ marginBottom: 16 }}>
						<p style={{ fontSize: 24, marginBottom: 8 }}>Presentation</p>
						<ul>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Better Timelines</p>
							</li>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Better Chat Interface</p>
							</li>
						</ul>
					</Box>

					<Box style={{ marginBottom: 16 }}>
						<p style={{ fontSize: 24, marginBottom: 8 }}>Quality of Life</p>
						<ul>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Timeline Widget</p>
							</li>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Bookmark Browser</p>
							</li>
						</ul>
					</Box>
					<Box>
						<p style={{ fontSize: 24, marginBottom: 8 }}>Privacy</p>
						<ul>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Shareable Block-List</p>
							</li>
							<li style={{ borderRadius: 8, padding: 8 }}>
								<p>Private Follow</p>
							</li>
						</ul>
					</Box>
				</Box>
				<Box
					style={{
						backgroundColor: '#242424',
						flexGrow: 1,
						padding: '10px 10px',
						borderRadius: 12,
						marginLeft: 32,
						display: 'flex',
						flexDirection: 'column',
						minHeight: '24rem',
						// height: '100%',
					}}
				>
					<Box
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ fontSize: 20 }}>{data[SelectedFeature].title}</p>
						<p style={{ fontSize: 16 }}>{data[SelectedFeature].subtitle}</p>
					</Box>
					<Box style={{ flexGrow: 1 }}></Box>
					<Box>
						<p
							style={{
								fontSize: 20,
								fontWeight: 500,
							}}
						>
							{data[SelectedFeature].why}
						</p>
						<p style={{ fontSize: 16 }}>
							{data[SelectedFeature].cards[FeatureGalleryIndex].solution}
						</p>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default FeatureGalleryWidget;
