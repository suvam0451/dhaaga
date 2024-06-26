import { Box, Flex, Text } from '@mantine/core';

// assets
// import GalleryStyleSearchModuleShowcase
//   from "../../../../public/assets/client-showcase/Search_Showcase.png";
// import DesktopGallery
//   from "../../../../public/assets/desktop-showcase/Three_Column_Full_Size.png";
import { useMemo, useState } from 'react';
import { ScrollImageHorizontallyOnHover } from '@/app/styles/App';
import Image from 'next/image';

function QolCategory() {
	const [SelectedCard, setSelectedCard] = useState('media-gallery');

	// const ImageToShow: Record<string, any> = {
	//   "media-gallery": {
	//     image: GalleryStyleSearchModuleShowcase,
	//     layout: "image",
	//     scrollBy: "0%",
	//   },
	//   "three-column-layout": {
	//     image: DesktopGallery,
	//     layout: "carousal",
	//     scrollBy: "-25%",
	//   },
	//   "scroll-to-top": {
	//     image: DesktopGallery,
	//     layout: "carousal",
	//     scrollBy: "-25%",
	//   },
	// };

	// const SelectedComponent = useMemo(
	//     () => ImageToShow[SelectedCard],
	//     [SelectedCard]
	// );
	return (
		<Flex justify={'space-between'} w={'100%'}>
			<Box color={'red'} maw={450}>
				<Text size={'sm'} c={'red'}>
					Convenience
				</Text>
				<Text size={'md'}>Every workflow is designed to be</Text>
				<Text size={'md'} c={'red'}>
					effortless and easy
				</Text>
				<Text>
					Improve the way you browse social networks, be it with your mouse or
					your keyboard.
				</Text>

				<Box
					my={'md'}
					bg={'#fff'}
					style={{ padding: '1rem' }}
					onClick={() => {
						setSelectedCard('media-gallery');
					}}
				>
					<Text c={'black'} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
						Media Gallery
					</Text>
					<Text c={'gray'} style={{ fontSize: '0.875rem' }}>
						{
							'"Media Only" timeline columns gets a new rework. Navigate gallery-style view with your keyboards.'
						}
					</Text>
				</Box>

				<Box
					mt={'md'}
					bg={'#fff'}
					style={{ padding: '1rem' }}
					onClick={() => {
						setSelectedCard('three-column-layout');
					}}
				>
					<Text c={'black'} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
						Three Column Layout
					</Text>
					<Text c={'gray'} style={{ fontSize: '0.875rem' }}>
						{
							'Perfect balance ⚖️ between the old-school multi-column layouts and newer single-column zen layouts.'
						}
					</Text>
				</Box>
				<Box
					mt={'md'}
					bg={'#fff'}
					style={{ padding: '1rem' }}
					onClick={() => {
						setSelectedCard('scroll-to-top');
					}}
				>
					<Text c={'black'} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
						Scroll to Top
					</Text>
					<Text c={'gray'} style={{ fontSize: '0.875rem' }}>
						{
							'Every relevant column loads new set of posts automatically. A handy scroll-to-top button makes.'
						}
					</Text>
				</Box>
			</Box>
			<Box w={16} />
			<Flex
				align={'center'}
				// justify={
				//   SelectedComponent.layout === "carousal" ? "flex-start" : "center"
				// }
				pos={'relative'}
				direction={'column'}
				w={600}
				style={{
					overflowX: 'clip',
					// border: "4px solid #ddd",
					borderRadius: '0.25rem',
				}}
			>
				<Flex
					w={'100%'}
					// justify={
					//   SelectedComponent.layout === "carousal" ? "flex-start" : "center"
					// }
				>
					{/*<Image*/}
					{/*    height={500}*/}
					{/*    objectFit="contain"*/}
					{/*    src={SelectedComponent.image}*/}
					{/*    alt={"showcase"}*/}
					{/*    style={{*/}
					{/*      boxShadow: "2px 2px",*/}
					{/*      border: "4px solid #333",*/}
					{/*      borderRadius: "0.25rem",*/}
					{/*    }}*/}
					{/*/>*/}
				</Flex>
				{/* <Flex align={"center"} justify={"center"} my={"xs"}>
					<IconChevronLeft size={32} />
					<IconChevronRight size={32} />
				</Flex> */}
			</Flex>
		</Flex>
	);
}

export default QolCategory;
