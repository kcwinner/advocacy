const path = require('path');
const { readFileSync, writeFileSync, ensureFileSync, pathExistsSync } = require('fs-extra');
const { parse } = require('graphql');
const gqlCodeGen = require('@graphql-codegen/core');
const typescriptPlugin = require('@graphql-codegen/typescript')

const Scalars = {
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

const Directives = {
    'aws_subscribe': '@aws_subscribe(mutations: [String!]!) on FIELD_DEFINITION',
    'aws_cognito_user_pools': '@aws_cognito_user_pools on FIELD_DEFINITION | OBJECT',
    'aws_iam': '@aws_iam on FIELD_DEFINITION | OBJECT',
    'deprecated': '@deprecated on INPUT_FIELD_DEFINITION | FIELD_DEFINITION | OBJECT'
}

generateModels();

async function generateModels() {
    const schemaContent = loadSchema('./schema.graphql');
    const outputDir = path.join('./src/types/');
    const schema = parse(schemaContent);

    typescriptPlugin.addToSchema = (config) => {
        const result = [];
        if (config.scalars) {
            if (typeof config.scalars === 'string') {
                result.push(config.scalars);
            } else {
                result.push(...Object.keys(config.scalars).map(scalar => `scalar ${scalar}`));
            }
        }

        if (config.directives) {
            if (typeof config.directives === 'string') {
                result.push(config.directives);
            } else {
                result.push(...Object.keys(config.directives).map(directive => `directive ${config.directives[directive]}`));
            }
        }

        return result.join('\n');
    };

    const config = {
        baseOutputDir: outputDir,
        filename: './src/types/api.ts', // Currently unused by typescript plugin
        schema: schema,
        config: { 
            scalars: Scalars,
            directives: Directives,
            maybeValue: 'T | null | undefined'
        },
        metadata: false,
        plugins: [
            { typescript: {} }
        ],
        pluginMap: {
            typescript: typescriptPlugin
        }
    }

    let generatedCode = await gqlCodeGen.codegen(config);

    ensureFileSync(config.filename);
    writeFileSync(config.filename, generatedCode);

    console.log(`Successfully generated models. Generated models can be found ${outputDir}`);
}

function loadSchema(schemaFilePath) {
    if (pathExistsSync(schemaFilePath)) {
        return readFileSync(schemaFilePath, 'utf8');
    }

    throw new Error('Could not load the schema');
}