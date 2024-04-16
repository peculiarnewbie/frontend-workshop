import { useLayoutEffect } from "react";
import { github, moon, sun } from "./icons";

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
		<header className=" shrink-0 flex justify-center bg-ctp-crust h-14 items-center">
			<div className="container flex justify-between px-6">
				<div className="flex items-center">logo</div>
				<div className="flex gap-4 items-center">
					<button
						className=" flex items-center rounded-full bg-ctp-base border border-ctp-surface0 hover:border-ctp-blue w-12 h-8"
						onClick={toggleDarkTheme}
					>
						<div
							className={` flex px-1 transition-all h-8 justify-end ${
								darkTheme ? "w-8" : "w-12"
							} `}
						>
							<div className=" flex justify-center items-center scale-75">
								{darkTheme ? moon : sun}
							</div>
						</div>
					</button>
					<div className="h-8 w-[2px] bg-ctp-surface0 rounded-full" />
					<a
						target="_blank"
						href="https://github.com/peculiarnewbie/frontend-workshop/tree/master/examples/remix-todo"
						className="bg-ctp-surface0 rounded-full p-1 border-ctp-surface0 hover:border-ctp-blue border"
					>
						<div className="scale-75">{github}</div>
					</a>
				</div>
			</div>
		</header>
	);
}

export default Header;
