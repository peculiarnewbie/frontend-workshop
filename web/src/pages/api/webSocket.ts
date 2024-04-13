import type { APIContext } from "astro";
// import { drizzle } from "drizzle-orm/d1";
// import { sessionsTable, usersTable } from "../../../db/schema";

export async function GET(context: APIContext) {
	// const runtime = context.locals.runtime;

	// const db = drizzle(runtime.env.D1);

	// const data = await db.select().from(sessionsTable);
	// return Response.json(data) bump;

	return Response.json({ hello: "world" });
}
