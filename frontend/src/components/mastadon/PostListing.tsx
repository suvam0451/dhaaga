import { Box, Flex, Image, Text } from "@mantine/core";
import { mastodon } from "masto";
import { LegacyRef, MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";
import {useLocation } from "react-router-dom"

function MastadonPostListing({ post }: { post: mastodon.v1.Status }) {
  const location = useLocation();

	function handleClicks(e: any) {
		console.log(e);
	}
  
	const onLinkClick = useCallback((e: any) => {
		// console.log(e.target);
		console.log("clicked", e);
    // e.preventDefault()
    // return false
    // e.preventDefault();

		// console.log(originalLink)
	}, [])

	function onClick() {
		// e.preventDefault();
	}
	function substituteHTML(input: string): string {
		const $elems = document.querySelectorAll('a')
		// console.log($elems)
var elems = Array.from($elems)
elems.map(a => {
	// @ts-ignore
  a.onclick = (e) => {
    e.preventDefault()
		const targetItem = e.currentTarget
		// @ts-ignore
		const val = targetItem.getAttribute("data-original-href")
		console.log(val)
  }
})

		var el = document.createElement("html");
		el.innerHTML = input;

		const links = el.getElementsByTagName("a"); // Live NodeList of your anchor elements
		for (let index = 0; index < links.length; index++) {
			// const element = links[index];
			// element.onclick = (e) => {onLinkClick(e)}
      // links[index].addEventListener("click", (e) => {onLinkClick(e)}, false)
      // links[index].onclick = onLinkClick;
      // links[index].on
			// console.log(element.getAttribute("href"));
			// element.onclick = onLinkClick;
			// links[index].innerHTML
			// = <Box></Box>
      links[index].onkeyup = onLinkClick;
			links[index].setAttribute("data-original-href", links[index].getAttribute("href")!);
			links[index].href = "javascript: void(0)";
      // links[index].href = `${location.pathname}`;
		}
		return el.innerHTML;
	}
	// Open all links externally

	// if (e.target && e.target.nodeName == 'A' && e.target.href) {
	//   const url = e.target.href;
	//   if (
	//     !url.startsWith('http://#') &&
	//     !url.startsWith('file://') &&
	//     !url.startsWith('http://wails.localhost:')
	//   ) {
	//     e.preventDefault();
	//     window.runtime.BrowserOpenURL(url);
	//   }
	// }

	return (
		<Box>
			<Flex>
				<Box h={"48px"} w={"48px"}>
					<Image src={post.account.avatar} />
				</Box>
				<Flex>
					<Flex>
						<Text>{post.account.displayName}</Text>
						<Text>@{post.account.username}</Text>
					</Flex>
					<Text>{post.createdAt}</Text>
				</Flex>
			</Flex>
			<div
				style={{ lineHeight: 1.2 }}
				dangerouslySetInnerHTML={{ __html: substituteHTML(post.content) }}
			></div>
		</Box>
	);
}

export default MastadonPostListing;
