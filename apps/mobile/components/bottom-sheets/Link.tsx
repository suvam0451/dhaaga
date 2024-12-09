import { useEffect, useMemo, useState } from 'react';
import { getLinkPreview } from 'link-preview-js';
import { View } from 'react-native';
import { Divider, Text } from '@rneui/themed';
import AppLoadingIndicator from '../error-screen/AppLoadingIndicator';
import NoOpengraph from '../error-screen/NoOpengraph';
import { Image } from 'expo-image';
import ReadMoreText from '../utils/ReadMoreText';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';

type ExternalLinkActionSheetProps = {
	url: string;
	displayName: string;
};

function ExternalLinkActionSheet({
	url,
	displayName,
}: ExternalLinkActionSheetProps) {
	const [Loading, setLoading] = useState(false);
	// avoid duplicate resolution
	const [IsParsed, setIsParsed] = useState(false);
	const [OpenGraphData, setOpenGraphData] = useState(null);

	async function resolveOpenGraph() {
		setOpenGraphData(null);
		setLoading(true);
		getLinkPreview(url)
			.then((res) => {
				setOpenGraphData(res as any);
			})
			.catch((e) => {
				console.log('[ERROR]: ogs', e);
			})
			.finally(() => {
				setLoading(false);
				setIsParsed(true);
			});
	}

	useEffect(() => {
		resolveOpenGraph();
	}, [url]);

	const domain = useMemo(() => {
		if (!OpenGraphData) return '';
		try {
			let domain = new URL(OpenGraphData.url);
			return domain.hostname;
		} catch (e) {
			return OpenGraphData.url;
		}
	}, [OpenGraphData]);

	return (
		<View
			style={{
				width: '100%',
				paddingHorizontal: 12,
				paddingBottom: 48,
			}}
		>
			<View>
				{Loading && <AppLoadingIndicator text={'Loading Preview'} />}
				{!Loading && !OpenGraphData && <NoOpengraph />}
				{!Loading && OpenGraphData && (
					<View>
						{OpenGraphData.images?.length > 0 && (
							<View style={{ height: 200, width: '100%' }}>
								{/*@ts-ignore*/}
								<Image
									source={OpenGraphData.images[0]}
									style={{
										height: 200,
										width: '100%',
										borderRadius: 8,
									}}
								/>
							</View>
						)}
						<View style={{ padding: 8 }}>
							<Text style={{ opacity: 0.3 }}>{domain}</Text>
							<ReadMoreText text={OpenGraphData.title} maxLines={1} bold />
							<ReadMoreText text={OpenGraphData.description} maxLines={2} />
						</View>
					</View>
				)}
			</View>
			<Divider style={{ opacity: 0.6, marginBottom: 16 }} />
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginHorizontal: 8,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 20,
					}}
				>
					<FontAwesome5
						name="external-link-alt"
						size={18}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
							color: APP_FONT.MONTSERRAT_BODY,
							marginLeft: 8,
						}}
					>
						Open
					</Text>
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 20,
					}}
				>
					<FontAwesome5
						name="external-link-alt"
						size={18}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
							color: APP_FONT.MONTSERRAT_BODY,
							marginLeft: 8,
						}}
					>
						Open
					</Text>
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 20,
					}}
				>
					<FontAwesome5
						name="external-link-alt"
						size={18}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
							color: APP_FONT.MONTSERRAT_BODY,
							marginLeft: 8,
						}}
					>
						Open
					</Text>
					s
				</View>
			</View>
		</View>
	);
}

export default ExternalLinkActionSheet;
