import { Box, Tabs, TextInput, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { ProviderAuthState } from "../../lib/redux/slices/authSlice";
import { GetCredentialsByAccountId } from "../../../wailsjs/go/main/App";
import { KeystoreService } from "../../services/keystore.services";
import { MastadonService } from "../../services/mastadon.service";
import { useDebouncedValue } from "@mantine/hooks";
import { mastodon } from "masto";
import MastadonUserListing from "../mastadon/UserListing";
import MastadonTagListing from "../mastadon/TagListing";

function MastadonDiscover() {
	return <Box></Box>;
}

export default MastadonDiscover;
