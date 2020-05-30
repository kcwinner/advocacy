const path = require('path');
const fs = require('fs-extra');
const { generate } = require('amplify-graphql-docs-generator');

generateStatements();

async function generateStatements() {
    let projectPath = process.cwd();
    const outputPath = path.join('./src/graphql/');

    const schemaPath = path.join(projectPath, './schema.graphql');
    const language = 'typescript';

    try {
        fs.ensureDirSync(outputPath);
        generate(schemaPath, outputPath, {
            separateFiles: true,
            language,
            maxDepth: 5
        });
    } catch(err) {
        console.error(err)
    }
}