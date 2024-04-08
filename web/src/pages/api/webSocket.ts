import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { sessionTable, userTable } from "../../../db/schema";

export async function GET(context: APIContext) {
	const runtime = context.locals.runtime;
	const url = new URL(context.request.url);

	const db = drizzle(runtime.env.D1);
	const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

	const data = await db.select().from(sessionTable);
	return Response.json(data);
}
