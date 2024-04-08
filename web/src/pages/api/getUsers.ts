import { usersTable } from "../../../db/schema";
import { getLuciaFromD1 } from "../../lib/auth";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const { db } = getLuciaFromD1(context.locals.runtime.env.D1);
	const data = await db.select().from(usersTable);
	const userAgent = context.request.headers.get("User-Agent");
	return Response.json(data);
}
