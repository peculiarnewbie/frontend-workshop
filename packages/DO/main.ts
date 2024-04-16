import {
	type DurableObjectNamespace,
	type DurableObjectState,
	type WebSocket as WS,
} from "@cloudflare/workers-types";

interface CloudflareWebsocket {
	accept(): unknown;
	addEventListener(
		event: "close",
		callbackFunction: (code?: number, reason?: string) => unknown
	): unknown;
	addEventListener(
		event: "error",
		callbackFunction: (e: unknown) => unknown
	): unknown;
	addEventListener(
		event: "message",
		callbackFunction: (event: { data: any }) => unknown
	): unknown;

	/**
	 * @param code https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
	 * @param reason
	 */
	close(code?: number, reason?: string): unknown;
	send(message: string | Uint8Array): unknown;
}

// class WebSocketPair {
// 	0: CloudflareWebsocket;
// 	1: CloudflareWebsocket;
// }

interface ResponseInit {
	status?: number;
	webSocket?: CloudflareWebsocket;
}

export default {
	async fetch(request: Request) {
		return new Response("Hello World", { status: 200 });
	},
};

// Durable Object
export class Rooms {
	state: DurableObjectState;

	constructor(state: DurableObjectState) {
		this.state = state;
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const procedure = path.split("room/")[1].split("/")[1];

		console.log("fetch in DO", url, procedure);
		if (procedure == "websocket") {
			const upgradeHeader = request.headers.get("Upgrade");
			if (!upgradeHeader || upgradeHeader !== "websocket") {
				return new Response(
					"Durable Object expected Upgrade: websocket",
					{ status: 426 }
				);
			}

			// Creates two ends of a WebSocket connection.
			const webSocketPair = new WebSocketPair();
			const [client, server] = Object.values(webSocketPair);

			this.state.acceptWebSocket(server as unknown as WS);

			// let body = "you are a watcher";

			// if (this.state.getWebSockets().length == 1) {
			// 	body = "you are the presenter";
			// }

			const response = {
				status: 101,
				webSocket: client,
			};

			return new Response(null, response);
		} else if (procedure == "getCurrentConnections") {
			// Retrieves all currently connected websockets accepted via `acceptWebSocket()`.
			let numConnections: number = this.state.getWebSockets().length;
			if (numConnections == 1) {
				return new Response(
					`There is ${numConnections} WebSocket client connected to this Durable Object instance.`
				);
			}
			return new Response(
				`There are ${numConnections} WebSocket clients connected to this Durable Object instance.`
			);
		}

		// Unknown path, reply with usage info.
		return new Response(`
This Durable Object supports the following endpoints:
  /websocket
    - Creates a WebSocket connection. Any messages sent to it are echoed with a prefix.
  /getCurrentConnections
    - A regular HTTP GET endpoint that returns the number of currently connected WebSocket clients.
`);
	}

	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		// Upon receiving a message from the client, reply with the same message,
		// but will prefix the message with "[Durable Object]: ".
		this.state.getWebSockets().forEach((ws) => {
			ws.send(message);
		});
	}

	async webSocketClose(
		ws: WebSocket,
		code: number,
		reason: string,
		wasClean: boolean
	) {
		// If the client closes the connection, the runtime will invoke the webSocketClose() handler.
		ws.close(code, "Durable Object is closing WebSocket");
	}
}
