import type { APIContext } from "astro";
import { getLuciaFromD1 } from "../../lib/auth";

export async function POST(context: APIContext): Promise<Response> {
	const { lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
	if (!context.locals.session) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(context.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	context.cookies.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);

	return new Response();
}
