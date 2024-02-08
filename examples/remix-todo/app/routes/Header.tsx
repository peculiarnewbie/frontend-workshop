import { useLayoutEffect } from "react";

function Header({
	darkTheme,
	setDarkTheme,
}: {
	darkTheme: boolean;
	setDarkTheme: (dark: boolean) => void;
}) {
	useLayoutEffect(() => {
		const dark = window.localStorage.getItem("darkTheme");
		if (!dark || dark == "true") {
			setDarkTheme(true);
			window.localStorage.setItem("darkTheme", darkTheme.toString());
		} else setDarkTheme(false);
	});

	const toggleDarkTheme = () => {
		const newTheme = !darkTheme;
		setDarkTheme(newTheme);
		window.localStorage.setItem("darkTheme", newTheme.toString());
	};

	return (
		<header className=" flex justify-center bg-slate-600 h-14 items-center">
			<div className="container flex justify-between">
				<p>logo</p>
				<div className="flex gap-4">
					<nav className="flex gap-2">
						<a>hi</a>
						<a>hey</a>
						<a href="https://peculiarnewbie.com">peculiarnewbie</a>
					</nav>
					<button onClick={toggleDarkTheme}>switch</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
