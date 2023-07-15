import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./lib/redux/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// pages
import IndexPage from "./pages/index";
import HomePage from "./pages/home";
import DatabasePage from "./pages/database";
import SearchPage from "./pages/search";
import SettingsPage from "./pages/settings";

const container = document.getElementById("root");
const root = createRoot(container!);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IndexPage />,
	},
	{
		path: "/home",
		element: <HomePage />,
	},
	{
		path: "/database",
		element: <DatabasePage />,
	},
	{
		path: "/search",
		element: <SearchPage />,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
	},
]);

root.render(
	<MantineProvider withGlobalStyles withNormalizeCSS>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</MantineProvider>
);
