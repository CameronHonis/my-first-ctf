import React from 'react';

const TYPEWRITER_TIME_PER_KEY = 500

/**
 * Adds a typewriter effect to a normal react string state
 * The Display state will cause state updates, so be mindful of re-renders!
 * @returns {[string, string, React.Dispatch<React.SetStateAction<string>>]} A tuple containing:
 *   - {string} The display string with the typewriter effect.
 *   - {string} The base string without the typewriter effect.
 *   - {React.Dispatch<React.SetStateAction<string>>} The string state setter.
 */
const useTypewriter = (init: string): [string, string, React.Dispatch<React.SetStateAction<string>>] => {
	const [base, setBase] = React.useState(init);
	const [display, setDisplay] = React.useState("");

	React.useEffect(() => {
		setDisplay("");
		let _display = "";
		setDisplay(_display);
		const loopId = setInterval(() => {
			_display = base.substring(0, _display.length + 1);
			setDisplay(_display);

			if (_display === base) {
				clearInterval(loopId);
			}
		}, TYPEWRITER_TIME_PER_KEY);

		return () => clearInterval(loopId);
	}, [base]);

	return [display, base, setBase];
}

function App() {
	const [reqStatus, setReqStatus] = React.useState<"loading" | "done" | "failed">("loading");
	const [flagDisplay, _, setFlag] = useTypewriter("");

	React.useEffect(() => {
		fetch("https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/74726f")
			.then(async req => {
				const _flag = await req.text();
				setFlag(_flag);
				setReqStatus("done");
			}).catch(() => {
				setReqStatus("failed");
			});
	});

	return (
		reqStatus === "loading" ?
			<p>Loading...</p>
			:
			<p>{flagDisplay}</p>
	);
}

export default App;

// CTF SCRIPT
// I first tried:
//
// `Array.from(document.querySelectorAll('code > div > span > i')).map(i => i.getAttribute("value")).join("")`
//
// which, in hindsight, did get me the correct answer. But I realized I was not validating the attributes of any of the
// parent elements, which was a constraint listed in the instructions website [here](https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/ramp-challenge-instructions/)
//
// my fear was that a few of the characters of the original solution were invalid, which would produce a "trick" url that looked like I was
// getting the correct flag, but would be ultimately wrong. For example, the true URL could be my original solution with the last character omitted
//
// next, I took a more methodical approach where I would map and filter elements as I move down the hierarchy of elements, until I got to the `<i>` tags:
//
// ```javascript
// code_eles = [...document.querySelectorAll("code")].filter(ele => /^23*/.test(ele.getAttribute("data-class")));
// div_eles = code_eles.flatMap((code_ele) => {
	// return Array.from(code_ele.children).filter(child => child.tagName === "DIV" && /93$/.test(child.getAttribute("data-tag")));
// }, []);
// span_eles = div_eles.flatMap(div_ele => {
    // return Array.from(div_ele.children).filter(child => child.tagName === "SPAN" && /21/.test(child.getAttribute("data-id")));
// });
// i_eles = span_eles.flatMap(span_ele => {
    // return Array.from(span_ele.children).filter(child => child.tagName === "I" && child.classList.contains("char"))
// });
// i_eles.map(i_ele => i_ele.getAttribute("value")).join("");
// ```
//
// note: This was ran in the chrome dev console on the "challenge" webpage
//
// I was disappointed to find that this extra work produced the same url, but I still had fun along the way :)

