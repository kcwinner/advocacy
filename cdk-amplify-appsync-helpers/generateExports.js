const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const cloudformation = new AWS.CloudFormation();

const STAGE = process.env.STAGE || 'dev'
const REGION = process.env.REGION || 'us-east-2'

const STACK_NAME = `prefix-api-${STAGE}`

const appsyncGraphQLURLOutputKey = 'appsyncGraphQLEndpointOutput';
const userPoolIdOutputKey = 'userPoolIdOutput';
const userPoolClientOutputKey = 'userPoolWebClientIdOutput';
const identityPoolIDOutputKey = 'identityPoolIDOutput';
const pinpointAppIDOutputKey = 'pinpointAppIDOutput';

let awsmobile = {
    aws_project_region: REGION,
    aws_appsync_graphqlEndpoint: '',
    aws_appsync_region: REGION,
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    Auth: {
        region: REGION,
        userPoolId: '',
        userPoolWebClientId: '',
        mandatorySignIn: true,
        cookiestorage: {
            domain: '.cool_domain.com',
            expires: 30,
            secure: true
        },
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    },
    aws_user_pools_id: '',
    aws_user_pools_web_client_id: '',
    aws_cognito_identity_pool_id: '',
    aws_cognito_region: REGION,
    aws_mobile_analytics_app_id: '',
    aws_mobile_analytics_app_region: 'us-east-1'
};

main()

async function main() {
    const exportFileName = 'aws-exports.js';
    console.log('Generating aws-exports.js')

    var describeStackParams = {
        StackName: STACK_NAME
    };
    const stackResponse = await cloudformation.describeStacks(describeStackParams).promise()
    const stack = stackResponse.Stacks[0];

    let appsyncGraphQLEndpoint = stack.Outputs.find(output => {
        return output.OutputKey === appsyncGraphQLURLOutputKey
    })

    let userPoolId = stack.Outputs.find(output => {
        return output.OutputKey === userPoolIdOutputKey
    })

    let userPoolWebClientId = stack.Outputs.find(output => {
        return output.OutputKey === userPoolClientOutputKey
    })

    let identityPoolID = stack.Outputs.find(output => {
        return output.OutputKey === identityPoolIDOutputKey
    })

    let pinpointAppID = stack.Outputs.find(output => {
        return output.OutputKey === pinpointAppIDOutputKey
    })

    awsmobile.aws_appsync_graphqlEndpoint = appsyncGraphQLEndpoint.OutputValue;
    awsmobile.Auth.userPoolId = userPoolId.OutputValue;
    awsmobile.Auth.userPoolWebClientId = userPoolWebClientId.OutputValue;
    awsmobile.aws_cognito_identity_pool_id = identityPoolID.OutputValue;
    awsmobile.aws_mobile_analytics_app_id = pinpointAppID.OutputValue;

    const curDir = process.cwd();

    let awsExportsPath = path.join(curDir, 'src', exportFileName);

    let data = `const awsmobile = ${JSON.stringify(awsmobile, null, 4)}
    
    export default awsmobile;`.replace(/^    export default awsmobile/gm, 'export default awsmobile');

    fs.writeFileSync(awsExportsPath, data);
}