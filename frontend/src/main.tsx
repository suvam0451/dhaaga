import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./lib/redux/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

// pages
import HomePage from "./pages/home";
import DatabasePage from "./pages/database";
import SearchPage from "./pages/search";
import SettingsPage from "./pages/settings";
import FavouritesPage from "./pages/favourites";
import LatestPage from "./pages/latest";
import GalleryPage from "./pages/gallery";
import AboutPage from "./pages/about";
import AccountsPage from "./pages/accounts";
import TasksPage from "./pages/tasks";

const container = document.getElementById("root");
const root = createRoot(container!);

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/home",
		element: <HomePage />,
	},
	{
		path: "/search",
		element: <SearchPage />,
	},
	{
		path: "/favourites",
		element: <FavouritesPage />,
	},
	{
		path: "/latest",
		element: <LatestPage />,
	},
	{
		path: "/gallery",
		element: <GalleryPage />,
	},
	{
		path: "/database",
		element: <DatabasePage />,
	},

	{
		path: "/settings",
		element: <SettingsPage />,
	},
	{
		path: "/about",
		element: <AboutPage />,
	},
	{
		path: "/accounts",
		element: <AccountsPage />,
	},
	{
		path: "/tasks",
		element: <TasksPage />,
	},
]);

root.render(
	<MantineProvider withGlobalStyles withNormalizeCSS>
		<Notifications />
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</MantineProvider>
);
