/*
    https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-origin-request
*/

import axios from 'axios';
import * as path from 'path';

let metaCache: any = {
    default: {
        OG_TITLE: 'DEFAULT - Empty Favicon',
        OG_DESCRIPTION: 'Default Example',
        OG_IMAGE: 'https://pbs.twimg.com/profile_images/1079111114548539392/sHF82MFf.jpg',
        OG_URL: 'https://any.advocacy.kennethwinner.com',
        FAVICON: 'https://kennethwinner.com/favicon.ico'
    },
    ssrdemo: {
        OG_TITLE: 'SSR DEMO ROOT - AWS Favicon',
        OG_DESCRIPTION: 'First Example - AWS Favicon',
        OG_IMAGE: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-1.2.1&auto=format&fit=crop&w=3452&q=80',
        OG_URL: 'https://ssrdemo.advocacy.kennethwinner.com',
        FAVICON: 'https://aws.amazon.com/favicon.ico'
    },
    ssrdemo2: {
        OG_TITLE: 'SSR DEMO Two - React Favicon',
        OG_DESCRIPTION: 'Second example - React Favicon',
        OG_IMAGE: 'https://images.unsplash.com/photo-1546098451-aee1bb4c1378?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3235&q=80',
        OG_URL: 'https://ssrdemo2.advocacy.kennethwinner.com',
        FAVICON: 'https://reactjs.org/favicon.ico'
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
            return getFavicon(appID);
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

        const metas = await getMetadata(appID);

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

async function getFavicon(appID: string) {
    console.log('GETTING FAVICON');
    const metas = await getMetadata(appID);

    return {
        status: 302,
        statusDescription: '302 Found',
        headers: {
            'location': [{ key: 'Location', value: metas['FAVICON'] }]
        }
    }
}

async function processOriginResponse(event: any = {}): Promise<any> {
    const { response } = event.Records[0].cf;

    // Do anything you need to do, if anything

    return response;
}

async function getMetadata(appID: string): Promise<any> {
    let metas: any = {};

    if (metaCache[appID] && metaCache[appID] !== {}) {
        console.log('Metadata is cached');
        metas = metaCache[appID];
    } else {
        // Make an api call and cache the results. For now we are going to just return the default
        metas = metaCache['default'];
    }

    return metas;
}