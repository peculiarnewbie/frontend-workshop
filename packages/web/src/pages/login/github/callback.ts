import { getGithub, getLuciaFromD1 } from "../../../lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { APIContext } from "astro";
import { usersTable } from "../../../../db/schema";

import { eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
	const { db, lucia } = getLuciaFromD1(context.locals.runtime.env.D1);
	const github = getGithub(
		context.locals.runtime.env.GITHUB_CLIENT_ID,
		context.locals.runtime.env.GITHUB_CLIENT_SECRET
	);

	const code = context.url.searchParams.get("code");
	const state = context.url.searchParams.get("state");
	const storedState =
		context.cookies.get("github_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
				"User-Agent": context.request.headers.get("User-Agent") ?? "",
			},
		});
		const text = await githubUserResponse.text();
		const json = JSON.parse(text);
		const githubUser: GitHubUser = { id: json.id, login: json.login };
		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.github_id, githubUser.id));

		if (existingUser.length > 0) {
			const session = await lucia.createSession(existingUser[0].id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			context.cookies.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			);
			return context.redirect("/");
		}

		const userId = generateId(15);
		await db.insert(usersTable).values({
			id: userId,
			github_id: githubUser.id,
			username: githubUser.login,
		});
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
		return context.redirect("/");
	} catch (e) {
		if (
			e instanceof OAuth2RequestError &&
			e.message === "bad_verification_code"
		) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
			//@ts-expect-error
			error: e,
		});
	}
}

interface GitHubUser {
	id: string;
	login: string;
}
