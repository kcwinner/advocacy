#!/bin/bash

echo "Copying Schema From cubejs-serverless-demo/"
cp ../cubejs-serverless-demo/appsync/schema.graphql ./

echo "Generating models from schema..."
node bin/generateModels.js

echo "Generating statements from schema..."
node bin/generateStatements.js

echo "Done! Removing schema file"
rm schema.graphql