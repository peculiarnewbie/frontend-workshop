import { verifyRequestOrigin } from "lucia";
import { defineMiddleware } from "astro:middleware";
import { getLuciaFromD1 } from "./lib/auth";
import type { APIContext } from "astro";

export const onRequest = defineMiddleware(async (context: APIContext, next) => {
	if (import.meta.env.MIDDLEWARE_FLAG === "false") {
		return next();
	}
	const { lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
	if (context.request.method !== "GET") {
		const originHeader = context.request.headers.get("Origin");
		const hostHeader = context.request.headers.get("Host");
		if (
			!originHeader ||
			!hostHeader ||
			!verifyRequestOrigin(originHeader, [hostHeader])
		) {
			return new Response(null, {
				status: 403,
			});
		}
	}
	const sessionId =
		context.cookies.get(lucia.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		context.locals.user = null;
		context.locals.session = null;
		return next();
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
	}
	context.locals.session = session;
	context.locals.user = user;
	return next();
});
