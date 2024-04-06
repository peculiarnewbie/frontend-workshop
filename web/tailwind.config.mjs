/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			keyframes: {
				"sonner-fade-in": {
					"0%": {
						opacity: 0,
						transform: "scale(0.8) translateY(-100px)",
					},
					"100%": { opacity: 1, transform: "scale(1)" },
				},
				"sonner-fade-out": {
					"0%": { opacity: 1, transform: "scale(1)" },
					"100%": {
						opacity: 0,
						transform: "scale(0.8) ",
					},
				},
			},
			animation: {
				"sonner-fade-in": "sonner-fade-in 300ms ease forwards",
				"sonner-fade-out": "sonner-fade-out 200ms ease forwards",
			},
		},
	},
	plugins: [
		require("@catppuccin/tailwindcss")({
			prefix: "ctp",
		}),
	],
	darkMode: "class",
};
