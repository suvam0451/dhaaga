import { Box } from '@mantine/core';
import { FaDiscord, FaGithub, FaMastodon } from 'react-icons/fa';
import Image from 'next/image';
import { styled } from 'styled-components';
import { SiMisskey } from 'react-icons/si';

import PlayStoreGetButtonImage from '../../../../public/assets/GetItOnGooglePlay_EN.png';

export function GithubDownloadButton() {
	return (
		<a
			href={
				'https://github.com/suvam0451/dhaaga/releases/download/v0.8.0/Dhaaga-v0.8.0.apk'
			}
		>
			<Box
				style={{
					border: '1px gray solid',
					borderColor: '#fff',
					padding: 8,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					borderRadius: 4,
				}}
			>
				<FaGithub size={22} color={'rgba(255, 255, 255, 0.87)'} />
				<p style={{ marginLeft: 4, fontSize: 18 }}>Download</p>
			</Box>
		</a>
	);
}

export function PlayStoreGetButton() {
	function playStoreGetClick() {
		window.open(
			'https://play.google.com/apps/testing/io.suvam.dhaaga',
			'_blank',
		);
	}

	return (
		<Image
			alt={'get it on google play'}
			src={PlayStoreGetButtonImage}
			style={{ marginLeft: 6 }}
			width={133.65}
			height={40}
			onClick={playStoreGetClick}
		/>
	);
}

const FindMeOnMastodonButton = styled(Box)`
	display: flex;
	flex-direction: row;
	color: rgba(255, 255, 255, 0.87);
	align-items: center;
	margin-right: 0.5rem;
	padding: 6px;
	border-radius: 8px;

	&:hover {
		background-color: rgb(99, 100, 255);
		//color: black;
	}

	transition: all 0.25s ease-out;
`;

export function FindMeOnMastodon() {
	return (
		<a href={'https://mastodon.social/@suvam'} target={'_blank'}>
			<FindMeOnMastodonButton>
				<FaMastodon size={18} />
				<p style={{ fontSize: 18, marginLeft: 4 }}>Mastodon</p>
			</FindMeOnMastodonButton>
		</a>
	);
}

const FindMeOnMisskeyButton = styled(Box)`
	display: flex;
	flex-direction: row;
	color: rgba(255, 255, 255, 0.87);
	align-items: center;
	margin-right: 0.5rem;
	padding: 6px;
	border-radius: 8px;

	&:hover {
		background-color: #86b300;
	}

	transition: all 0.25s ease-out;
`;

export function FindMeOnMisskey() {
	return (
		<a href={'https://misskey.io/@suvam0451'} target={'_blank'}>
			<FindMeOnMisskeyButton>
				<SiMisskey size={18} />
				<p style={{ fontSize: 18, marginLeft: 4 }}>Misskey</p>
			</FindMeOnMisskeyButton>
		</a>
	);
}

const FindMeOnGithubButton = styled(Box)`
	display: flex;
	flex-direction: row;
	color: rgba(255, 255, 255, 0.87);
	align-items: center;
	margin-right: 0.5rem;
	padding: 6px;
	border-radius: 8px;

	&:hover {
		background-color: white;
		color: black;

		> p {
			color: black;
			transition: color 0.5s ease-out;
		}
	}

	transition: all 0.25s ease-out;
`;

export function FindMeOnGithub() {
	return (
		<a href={'https://github.com/suvam0451'} target={'_blank'}>
			<FindMeOnGithubButton>
				<FaGithub size={18} />
				<p style={{ fontSize: 18, marginLeft: 4 }}>GitHub</p>
			</FindMeOnGithubButton>
		</a>
	);
}

const FindMeOnDiscordButton = styled(Box)`
	display: flex;
	flex-direction: row;
	color: rgba(255, 255, 255, 0.87);
	align-items: center;
	margin-right: 0.5rem;
	padding: 6px;
	border-radius: 8px;

	&:hover {
		background-color: #5865f2;

		//> p {
		//	color: black;
		//	transition: color 0.5s ease-out;
		//}
	}

	transition: all 0.25s ease-out;
`;

export function FindMeOnDiscord() {
	return (
		<a href={'https://discord.gg/Jc46bZAYZK'} target={'_blank'}>
			<FindMeOnDiscordButton>
				<FaDiscord size={18} />
				<p style={{ fontSize: 18, marginLeft: 4 }}>Discord</p>
			</FindMeOnDiscordButton>
		</a>
	);
}
