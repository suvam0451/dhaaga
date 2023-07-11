import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import {
	GetImagesForProfile,
	GetImagesFromThread,
} from "../wailsjs/go/main/App";

function App() {
	const [resultText, setResultText] = useState(
		"Please enter your name below 👇"
	);
	const [name, setName] = useState("");
	const updateName = (e: any) => setName(e.target.value);
	const updateResultText = (result: string) => setResultText(result);
	const [GalleryItems, setGalleryItems] = useState<string[]>([]);
	const [SearchQuery, setSearchQuery] = useState<{
		query: string;
		type?: "profile" | "thread";
	}>({
		query: "",
		type: undefined,
	});
	const [IsLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log(GalleryItems);
	}, [GalleryItems]);

	async function greet() {
		setIsLoading(true);
		const regex = new RegExp("https://www.threads.net/t/(.*?)/?$");
		const profileRegex = new RegExp("https://www.threads.net/(@.*?)/?$");

		// item is a thread
		if (regex.test(name)) {
			const query = name.match(regex)![1];

			try {
				setSearchQuery({
					query,
					type: "thread",
				});
				const res = await GetImagesFromThread(query);
				setGalleryItems(res);
			} catch (e) {
				console.log(e);
			}
		} else if (profileRegex.test(name)) {
			const query = name.match(profileRegex)![1];

			try {
				setSearchQuery({
					query,
					type: "profile",
				});
				const res = await GetImagesForProfile(query);
				setGalleryItems(res);
			} catch (e) {
				console.log(e);
			}
		}
		setIsLoading(false);
	}

	return (
		<div id="App">
			<img src={logo} id="logo" alt="logo" />
			<div id="result" className="result">
				{resultText}
			</div>
			<div id="input" className="input-box">
				<input
					id="name"
					className="input"
					onChange={updateName}
					autoComplete="off"
					name="input"
					type="text"
				/>
				<button className="btn" onClick={greet}>
					Greet
				</button>
			</div>
		</div>
	);
}

export default App;
