import * as knex from 'knex';

const QueryCompiler = require('knex/lib/dialects/mysql/query/compiler');
const ColumnCompiler = require('knex/lib/dialects/mysql/schema/columncompiler');
const TableCompiler = require('knex/lib/dialects/mysql/schema/tablecompiler');
const SchemaCompiler = require('knex/lib/dialects/mysql/schema/compiler');
const { makeEscape } = require('knex/lib/query/string');

export default class RDSDataAPI extends knex.Client {
    dialect: string = 'mysql';
    driverName: string = 'data-api-client';
    canCancelQuery: boolean = false;
    config: any;

    constructor(config: any) {
        super(config);

        this.config = config;
        this.dialect = 'mysql';
    }

    _escapeBinding = makeEscape();

    wrapIdentifierImpl(value: any) {
        return value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*';
    }

    positionBindings(sql: any) {
        let questionCount = -1;
        return sql.replace(/\\?\?/g, (match: any) => {
            if (match === '\\?') {
                return '?';
            }

            questionCount += 1;
            return `:b${questionCount}`;
        });
    }

    async hasTable() {
        console.log('CALLING HAS TABLE');
    }

    // Runs the query on the specified connection, providing the bindings
    // and any other necessary prep work.
    async _query(connection: any, obj: any) {
        const rawBindings = obj.bindings;
        let templateVar: any = {};

        if (rawBindings) {
            for (var i = 0; i < rawBindings.length; i++) {
                templateVar[`b${i}`] = rawBindings[i];
            }
        }

        const result = await connection.query(obj.sql, templateVar)
        if (result.numberOfRecordsUpdated) return result.numberOfRecordsUpdated;

        if (obj.output) {
            return obj.output(result?.records);
        } 

        return result?.records;
    }

    // Ensures the response is returned in the same format as other clients.
    processResponse(obj: any, _: any) {
        return obj;
    }

    queryCompiler() {
        return new QueryCompiler(this, ...arguments);
    }

    tableCompiler() {
        return new TableCompiler(this, ...arguments);
    }

    schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
    }

    columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
    }

    // Acquire a connection from the pool.
    async acquireConnection() {
        try {
            const dataApi = require('data-api-client')({
                secretArn: this.config.connection.secretArn,
                resourceArn: this.config.connection.resourceArn,
                database: this.config.connection.database,
                options: {
                    httpOptions: {
                        timeout: 240000
                    }
                }
            })

            return dataApi;
        } catch (error) {
            let convertedError = error;
            throw convertedError;
        }
    }

    // returns a resolved promise because we don't actually have a connection pool
    releaseConnection(_: any) {
        return Promise.resolve();
    }
}