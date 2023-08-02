import {
	View,
	Text,
	TextInput,
	Keyboard,
	TouchableOpacity,
} from "react-native";
import { Button } from "@rneui/themed";
import { StandardView } from "../../styles/Containers";
import { MainText } from "../../styles/Typography";
import React, { useEffect, useState } from "react";
import { MastodonService } from "@dhaaga/shared-provider-mastodon/dist";

function SelectServer({ Step, nextStep, setAuthUri, setSubdomain }: any) {}

export default SelectServer;
