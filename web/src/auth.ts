import { Lucia } from "lucia";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD,
		},
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}
