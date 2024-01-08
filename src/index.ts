/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { getName } from 'country-list';
import { getCountryFlag } from './country';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	COUNTRY_FLAG: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const html_style = 'body{padding:6em; font-family: sans-serif;} h1{color:#f6821f;}';
		const cfaccessemail = request.headers.get('cf-access-authenticated-user-email');
		const url = new URL(request.url);

		const content = `${cfaccessemail} authenticated at ${new Date().toLocaleString('en-US', {
			timeZone: request.cf?.timezone as string,
		})} from <a href="secure/${request.cf?.country as string}" target="_blank"> ${getName(request.cf?.country as string)} </a>`;

		const html = `<!DOCTYPE html>
			<head>
				<title>TVE Assessment</title>
				<style> ${html_style} </style>
			</head>
			<body>
				<h1>TVE Assessment: Cloudflare Worker!</h1>
				${content}
			</body>`;

		if (url.pathname === `/secure/${request.cf?.country}`) {
			return await getCountryFlag(request.cf?.country as string, env);
		}

		return new Response(html, {
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		});
	},
};
