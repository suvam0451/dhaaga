import {Box, Button, Text} from "@mantine/core";

function IntroComponent() {
  return (
      <Box maw={500}>
        <Text size={"lg"} style={{lineHeight: 1.2, fontWeight: 600}}>
          Experience Fediverse
        </Text>
        <Text size={"lg"} style={{lineHeight: 1.2, fontWeight: 600}}>
          with feature packed cross-platform clients
        </Text>
        <Text mt={"lg"} style={{fontSize: "16px"}}>
          Dhaaga client is an all-in-one fediverse browsing client with support
          for multiple protocols, intuitive design and boatloads of utility
          features,
          repacked for your with features.
        </Text>
        <Button mt={"md"}>Quick Start</Button>
      </Box>
  );
}

export default IntroComponent;
