import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), solidJs()],
	output: "server",
	adapter: cloudflare({
		runtime: {
			mode: "local",
			type: "pages",
			bindings: {
				D1: {
					type: "d1",
				},
			},
		},
	}),
});
