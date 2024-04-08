/// <reference types="astro/client" />

type D1Namespace = import("@cloudflare/workers-types/experimental").D1Database;
type ENV = {
	SERVER_URL: string;
	D1: D1Namespace;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
	interface Locals extends Runtime {
		user: {
			name: string;
			surname: string;
		};
	}
}
