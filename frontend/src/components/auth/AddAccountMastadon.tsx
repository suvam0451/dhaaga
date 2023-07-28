import {
	Box,
	Button,
	Flex,
	TextInput,
	Text,
	Select,
	Drawer,
	Loader,
} from "@mantine/core";
import { useState } from "react";
import { MastadonService } from "../../services/mastadon.service";
import { MastadonWorker } from "../../services/mastadon-worker.service";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import ClickToPaste from "../utils/ClickToPaste";

function AddAccountMastadon() {
	return <Box my={"md"}></Box>;
}

export default AddAccountMastadon;
