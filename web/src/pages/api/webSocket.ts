import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const runtime = context.locals.runtime;
	const url = new URL(context.request.url);
	// const searchParams = new URLSearchParams(url.search);
	// const date = parseParams(searchParams);
	// const nextMonth = date.add(1, "month");
	// const db = drizzle(runtime.env.D1);
	// const data = (await db
	//     .select()
	//     .from(transactions)
	//     .where(
	//         and(
	//             between(transactions.date, date.valueOf(), nextMonth.valueOf()),
	//             not(eq(transactions.date, nextMonth.valueOf())),
	//         ),
	//     )) as DataType[];
	// // const data = dummyData;
	// return Response.json(data);
}
