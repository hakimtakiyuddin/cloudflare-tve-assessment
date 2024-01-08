import { Env } from '.';

export async function getCountryFlag(countryName: string, env: Env): Promise<Response> {
	const flag = await env.COUNTRY_FLAG.get(`${countryName}.png`);

	if (flag === null) {
		return await new Response('Country flag not found', { status: 404 });
	}
	const headers = new Headers();
	flag.writeHttpMetadata(headers);
	headers.set('etag', flag.httpEtag);
    console.log(flag.body.values)
	return await new Response(flag.body, {
		headers,
	});
}
