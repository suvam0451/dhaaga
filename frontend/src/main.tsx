import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import store from "./store";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
	<React.StrictMode>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Provider store={store}>
				<App />
			</Provider>
		</MantineProvider>
	</React.StrictMode>
);
