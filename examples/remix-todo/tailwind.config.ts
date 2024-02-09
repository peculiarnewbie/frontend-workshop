import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("@catppuccin/tailwindcss")({
			prefix: "ctp",
		}),
	],
	darkMode: "class",
} satisfies Config;
