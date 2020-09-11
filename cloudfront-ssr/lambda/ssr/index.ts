/*
    https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-viewer-request
*/

import * as path from 'path';

let metaCache: any = {
    ssrdemo: {
        OG_TITLE: 'SSR DEMO ROOT',
        OG_DESCRIPTION: 'First Example',
        OG_IMAGE: 'https://unsplash.com/photos/zwsHjakE_iI',
        OG_URL: 'https://ssrdemo.kennethwinner.com',
    },
    ssrdemo2: {
        OG_TITLE: 'SSR DEMO Two',
        OG_DESCRIPTION: 'Second example',
        OG_IMAGE: 'https://unsplash.com/photos/6Kn_XRlhDAs',
        OG_URL: 'https://ssrdemo2.kennethwinner.com',
    }
}

export const handler = async (event: any = {}): Promise<any> => {
    const { config, request } = event.Records[0].cf;

    console.log(`Event: ${JSON.stringify(event)}`)
    console.log('## Request URI: ', request.uri);
    console.log('## Event Type: ', config.eventType);

    switch (config.eventType) {
        case 'origin-request':
            return await processOriginRequest(request);
        case 'origin-response':
            return await processOriginResponse(event);
        default:
            return request;
    }
}

async function processOriginRequest(request: any = {}): Promise<any> {
    // Rewrite header
    let originalHost = request.headers.host[0].value;
    let bucketDomain = request.origin.custom.domainName;

    // Example Referer - https://coopdreams.dev.getvoxi.app/episodes
    console.log('## Host: ', originalHost);
    if (!originalHost) {
        console.log('No Host');
        return request;
    }

    const appID = originalHost.split('.')[0];

    switch (request.uri) {
        case '/index.html':
            break;
        case '/favicon.ico':
            return getShowFavicon(appID, originalHost);
        // case '/manifest.json':
        default:
            if (path.extname(request.uri) !== "") {
                request.headers['x-forwarded-host'] = [{ key: 'X-Forwarded-Host', value: originalHost }];
                request.headers.host = [{ key: 'Host', value: bucketDomain }];
                return request;
            }
    }

    try {
        const siteURL = `http://${bucketDomain}/index.html`;
        console.log('## SITE URL: ', siteURL);

        const indexResult = await axios.get(siteURL);
        let index = indexResult.data;

        const metas = await getShowMetadata(appID, originalHost);

        for (const meta in metas) {
            if (metas.hasOwnProperty(meta)) {
                index = index.replace(new RegExp(`__${meta}__`, 'g'), metas[meta]);
            }
        }

        return {
            status: 200,
            statusDescription: 'HTTP OK',
            body: index
        }
    } catch (err) {
        console.log('### ERROR ###');
        console.log(JSON.stringify(err));
    }

    return request;
}

async function getShowFavicon(appID: string, originalHost: string) {
    console.log('GETTING FAVICON');
    const metas = await getShowMetadata(appID, originalHost);

    return {
        status: 302,
        statusDescription: '302 Found',
        headers: {
            'location': [{ key: 'Location', value: metas['FAVICON'] }]
        }
    }
}

async function processOriginResponse(event: any = {}): Promise<any> {
    const { request, response } = event.Records[0].cf;
    const hostValue = request.headers['x-forwarded-host'][0].value;

    // Rewrite header
    request.headers.host = [{ key: 'Host', value: hostValue }];

    return response;
}

async function getShowMetadata(appID: string): Promise<any> {
    let metas: any = {};

    if (metaCache[appID] && metaCache[appID] !== {}) {
        console.log('Metadata is cached');
        metas = metaCache[appID];
    } else {
        // Make an api call and cache the results
    }

    return metaCache[appID];
}