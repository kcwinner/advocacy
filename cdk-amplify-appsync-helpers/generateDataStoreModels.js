const path = require('path');
const { readFileSync, writeFileSync, ensureFileSync, pathExistsSync } = require('fs-extra');
const { parse } = require('graphql'); // Requires version ^14.5.8
const gqlCodeGen = require('@graphql-codegen/core'); // Requires version ^1.8.3
const appSyncDataStoreCodeGen = require('amplify-codegen-appsync-model-plugin');

const scalars = {
    ID: "string",
    String: "string",
    Int: "number",
    Float: "number",
    Boolean: "boolean",
    AWSDate: "string",
    AWSDateTime: "string",
    AWSTime: "string",
    AWSTimestamp: "number",
    AWSEmail: "string",
    AWSJSON: "string",
    AWSURL: "string",
    AWSPhone: "string",
    AWSIPAddress: "string"
}

const defaultDirectives = {
    'aws_subscribe': '@aws_subscribe(mutations: [String!]!) on FIELD_DEFINITION',
    'connection': '@connection(name: String) on FIELD_DEFINITION',
    'model': '@model on OBJECT'
}

const directives = Object.keys(defaultDirectives).map(directive => `directive ${defaultDirectives[directive]}`).join('\n')

generateModels();

async function generateModels() {
    const schemaContent = loadSchema('./schema.graphql');
    const outputPath = path.join('./src');
    const schema = parse(schemaContent);

    const appsyncLocalConfig = await appSyncDataStoreCodeGen.preset.buildGeneratesSection({
        baseOutputDir: outputPath,
        schema,
        config: {
            target: 'typescript',
            scalars: scalars,
            directives: directives,
        },
    });

    const codeGenPromises = appsyncLocalConfig.map(cfg => {
        return gqlCodeGen.codegen({
            ...cfg,
            plugins: [
                {
                    appSyncLocalCodeGen: {},
                },
            ],
            pluginMap: {
                appSyncLocalCodeGen: appSyncDataStoreCodeGen,
            },
        });
    });

    const generatedCode = await Promise.all(codeGenPromises);
    appsyncLocalConfig.forEach((cfg, idx) => {
        const outPutPath = cfg.filename;
        ensureFileSync(outPutPath);
        writeFileSync(outPutPath, generatedCode[idx]);
    });

    console.log(`Successfully generated models. Generated models can be found ${outputPath}`);
}

function loadSchema(schemaFilePath) {
    if (pathExistsSync(schemaFilePath)) {
        return readFileSync(schemaFilePath, 'utf8');
    }

    throw new Error('Could not load the schema');
}