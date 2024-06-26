/// <reference types="astro/client" />

type D1Namespace = import("@cloudflare/workers-types/experimental").D1Database;
type ENV = {
	D1: D1Namespace;
	DO: DurableObjectNamespace;
	GITHUB_CLIENT_ID: string;
	GITHUB_CLIENT_SECRET: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
	interface Locals extends Runtime {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
}
