"use client";

import React from "react";
import "./style.css";
import { MantineProvider } from "@mantine/core";
import { Providers } from "../lib/providers";

function RootLayout(props: React.PropsWithChildren<{}>) {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Providers>
				<html lang="en">
					<head>
						{/* <meta charset="UTF-8" /> */}
						<meta
							content="width=device-width, initial-scale=1.0"
							name="viewport"
						/>
						<title>myproject</title>
					</head>
					<body>
						<div id="root"></div>
						<main>{props.children}</main>
					</body>
				</html>
			</Providers>
		</MantineProvider>
	);
}

export default RootLayout;
