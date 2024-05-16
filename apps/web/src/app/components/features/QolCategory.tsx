import {Box, Button, Flex, Text} from "@mantine/core";
import Image from "next/image";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";

// assets
import GalleryStyleSearchModuleShowcase
  from "../../../../public/assets/client-showcase/Search_Showcase.png";
import DesktopGallery
  from "../../../../public/assets/desktop-showcase/Three_Column_Full_Size.png";
import {useMemo, useState} from "react";
import {ScrollImageHorizontallyOnHover} from "@/app/styles/App";

function QolCategory() {
  const [SelectedCard, setSelectedCard] = useState("media-gallery");

  const ImageToShow: Record<string, any> = {
    "media-gallery": {
      image: GalleryStyleSearchModuleShowcase,
      layout: "image",
      scrollBy: "0%",
    },
    "three-column-layout": {
      image: DesktopGallery,
      layout: "carousal",
      scrollBy: "-25%",
    },
    "scroll-to-top": {
      image: DesktopGallery,
      layout: "carousal",
      scrollBy: "-25%",
    },
  };

  const SelectedComponent = useMemo(
      () => ImageToShow[SelectedCard],
      [SelectedCard]
  );
  return (
      <Flex justify={"space-between"} w={"100%"}>
        <Box color={"red"} maw={450}>
          <Text size={16} color={"red"}>
            Convenience
          </Text>
          <Text size={28}>Every workflow is designed to be</Text>
          <Text size={28} color={"red"}>
            effortless and easy
          </Text>
          <Text>
            Improve the way you browse social networks, be it with your mouse or
            your keyboard.
          </Text>

          <Box
              my={"md"}
              bg={"#fff"}
              style={{padding: "1rem"}}
              onClick={() => {
                setSelectedCard("media-gallery");
              }}
          >
            <Text
                color={"black"}
                style={{fontWeight: 600, fontSize: "0.875rem"}}
            >
              Media Gallery
            </Text>
            <Text color={"gray"} style={{fontSize: "0.875rem"}}>
              {
                '"Media Only" timeline columns gets a new rework. Navigate gallery-style view with your keyboards.'
              }
            </Text>
          </Box>

          <Box
              mt={"md"}
              bg={"#fff"}
              style={{padding: "1rem"}}
              onClick={() => {
                setSelectedCard("three-column-layout");
              }}
          >
            <Text
                color={"black"}
                style={{fontWeight: 600, fontSize: "0.875rem"}}
            >
              Three Column Layout
            </Text>
            <Text color={"gray"} style={{fontSize: "0.875rem"}}>
              {
                "Perfect balance ⚖️ between the old-school multi-column layouts and newer single-column zen layouts."
              }
            </Text>
          </Box>
          <Box
              mt={"md"}
              bg={"#fff"}
              style={{padding: "1rem"}}
              onClick={() => {
                setSelectedCard("scroll-to-top");
              }}
          >
            <Text
                color={"black"}
                style={{fontWeight: 600, fontSize: "0.875rem"}}
            >
              Scroll to Top
            </Text>
            <Text color={"gray"} style={{fontSize: "0.875rem"}}>
              {
                "Every relevant column loads new set of posts automatically. A handy scroll-to-top button makes."
              }
            </Text>
          </Box>
        </Box>
        <Box w={16}/>
        <Flex
            align={"center"}
            justify={
              SelectedComponent.layout === "carousal" ? "flex-start" : "center"
            }
            pos={"relative"}
            direction={"column"}
            w={600}
            style={{
              overflowX: "clip",
              // border: "4px solid #ddd",
              borderRadius: "0.25rem",
            }}
        >
          <Flex
              w={"100%"}
              justify={
                SelectedComponent.layout === "carousal" ? "flex-start" : "center"
              }
          >
            <ScrollImageHorizontallyOnHover
                height={500}
                objectFit="contain"
                src={SelectedComponent.image}
                alt={"showcase"}
                style={{
                  boxShadow: "2px 2px",
                  border: "4px solid #333",
                  borderRadius: "0.25rem",
                }}
                moveby={SelectedComponent.scrollBy}
            />
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
