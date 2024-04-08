import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { sessionsTable, usersTable } from "../../db/schema";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1/driver";
import { drizzle } from "drizzle-orm/d1";

export const initAdapter = (db: DrizzleD1Database) => {
	return new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);
};

export const getLucia = (adapter: DrizzleSQLiteAdapter) => {
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: import.meta.env.PROD,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				githubId: attributes.github_id,
				username: attributes.username,
			};
		},
	});
};
declare module "lucia" {
	interface Register {
		Lucia: ReturnType<typeof getLucia>;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export const getLuciaFromD1 = (d1: D1Database) => {
	const db = drizzle(d1);
	const adapter = initAdapter(db);
	return {
		db: db,
		adapter: adapter,
		lucia: getLucia(adapter),
	};
};

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
}

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET
);
