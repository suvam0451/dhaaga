import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {GetImagesFromThread, Greet} from "../wailsjs/go/main/App";

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    async function greet() {
        console.log("greet attempted")
        const regex = new RegExp('https://www\.threads\.net/t/(.*?)/')

        // item is a thread
        if(regex.test(name)) {
            const query = name.match(regex)![1]
            
            const res = await GetImagesFromThread(query)
            console.log(query, res)
        }
        // if()
        // Greet(name).then(updateResultText);
        // const res = await GetImagesFromThread(name)
        // console.log("images", res)
    }

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App
