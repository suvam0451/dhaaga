import { Box } from '@mantine/core';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';
import { useState } from 'react';
import {
	FindMeOnDiscord,
	FindMeOnGithub,
	FindMeOnMastodon,
	FindMeOnMisskey,
	GithubDownloadButton,
	PlayStoreGetButton,
} from '@/app/components/custom/Buttons';
import TimelineWidget001 from '../../../public/assets/app-screenshots/Timeline_Widget_001.png';

const features = [
	{
		title: 'Timeline Widget',
		description: 'Easily switch between timelines',
	},
	{
		title: 'Comment Threads',
		description: 'Keep track of the conversation',
	},
	{
		title: 'Dedicated Chat UI',
		description: 'Improved Direct Messaging Interface',
	},
];

const IMAGE_WIDTH = 225;
const IMAGE_CONTAINER_MAX_WIDTH = 225 + 6 * 2;

function Introduction() {
	const [SelectedFeatureIndex, setSelectedFeatureIndex] = useState(1);

	function onClickSelectedFeatureIndexChanged(i: number) {
		setSelectedFeatureIndex(i);
	}

	return (
		<Box
			style={{
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Box
				style={{
					marginTop: '2rem',
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<p
					style={{
						fontSize: 36,
						fontWeight: 700,
						maxWidth: '32rem',
						marginBottom: 16,
					}}
				>
					Social networking client for{' '}
					<p style={{ color: 'rgba(99, 100, 255)', display: 'inline' }}>
						Mastodon
					</p>{' '}
					and <p style={{ color: '#86b300', display: 'inline' }}>Misskey</p>
				</p>
				<p
					style={{
						fontSize: 20,
						fontWeight: 500,
						color: 'rgba(255, 255, 255, 0.75)',
					}}
				>
					Opinionated | Feature Rich | Cross Platform | Open Source
				</p>

				<Box
					style={{
						marginTop: 16,
						marginBottom: 32,
					}}
				>
					<Box
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<GithubDownloadButton />
						<PlayStoreGetButton />
					</Box>
					<p
						style={{
							fontSize: 14,
							color: 'rgba(255, 255, 255, 0.6)',
							marginTop: 8,
						}}
					>
						v0.0.1 • Play store build is available as closed beta.
					</p>
				</Box>

				<Box style={{ flexGrow: 1 }}></Box>
				<Box style={{ marginBottom: '2rem' }}>
					<Box style={{ marginBottom: 8 }}>
						<p>This project is developed and maintained by @suvam0451</p>
					</Box>

					<p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Find him on:</p>
					<Box style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
						<FindMeOnGithub />
						<FindMeOnMastodon />
						<FindMeOnMisskey />
						<FindMeOnDiscord />
					</Box>

					<p
						style={{
							color: 'rgba(255, 255, 255, 0.6)',
							marginTop: 16,
							marginBottom: 8,
						}}
					>
						Or e-mail him at:{' '}
					</p>
					<Box
						style={{
							display: 'flex',
							flexDirection: 'row',
							color: 'rgba(255, 255, 255, 0.87)',
							alignItems: 'center',
							marginRight: '0.5rem',
						}}
					>
						<MdEmail size={20} />
						<p style={{ fontSize: 18, marginLeft: 4 }}>hi@suvam.io</p>
					</Box>
				</Box>
				<Box style={{ height: 32 }} />
			</Box>
			<Box
				style={{
					marginLeft: 16,
					marginRight: 0,
					maxWidth: IMAGE_CONTAINER_MAX_WIDTH,
					// backgroundColor: 'blue',
				}}
			>
				<Box
					style={{
						padding: 6,
						backgroundColor: '#2c2c2c',
						borderRadius: 8,
					}}
				>
					<Image
						src={TimelineWidget001}
						alt={'Timeline Widget 001'}
						width={225}
						height={500}
						aria-orientation={'vertical'}
					/>
					<Box style={{ marginTop: 8 }}>
						<p
							style={{
								color: 'rgba(255, 255, 255, 0.87)',
								fontWeight: 500,
								textAlign: 'center',
								fontSize: 20,
							}}
						>
							{features[SelectedFeatureIndex].title}
						</p>
						<p
							style={{
								textAlign: 'center',
								fontSize: 16,
								color: 'rgba(255, 255, 255, 0.6)',
								marginTop: 8,
							}}
						>
							{features[SelectedFeatureIndex].description}
						</p>
					</Box>
				</Box>
				<Box
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 8,
					}}
				>
					{features.map((o, i) => (
						<Box
							key={i}
							style={styles.pelletClickableArea}
							onClick={() => {
								onClickSelectedFeatureIndexChanged(i);
							}}
						>
							<Box
								style={
									SelectedFeatureIndex === i
										? styles.activePellet
										: styles.inactivePellet
								}
							/>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}

const styles = {
	activePellet: {
		width: 14,
		height: 14,
		// margin: '0 10px',
		backgroundColor: 'rgba(255, 255, 255, 0.6)',
		borderRadius: '50%',
	},
	pelletClickableArea: {
		padding: '0 10px',
		// backgroundColor: 'blue',
		height: '100%',
		display: 'flex',
		minHeight: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inactivePellet: {
		width: 8,
		height: 8,
		// margin: '0 10px',
		// backgroundColor: 'rgba(255, 255, 255, 0.6)',
		borderRadius: '50%',
		backgroundColor: 'red',
	},
};

export default Introduction;
