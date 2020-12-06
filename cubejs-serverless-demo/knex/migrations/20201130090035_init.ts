import * as Knex from "knex";

const initTables = [ 'line_items', 'orders', 'product_categories', 'products', 'suppliers', 'users' ];

export async function up(knex: Knex): Promise<any> {
    knex.client.dialect = 'mysql';

    const lineItemsTable = await knex.schema.hasTable('line_items');
    if (!lineItemsTable) {
        await knex.schema.createTable('line_items', (table) => {
            table.bigIncrements('id').notNullable();
            table.integer('product_id');
            table.integer('order_id');
            table.integer('quantity');
            table.integer('price');
            table.timestamp('created_at');
        });
    }

    const ordersTable = await knex.schema.hasTable('orders');
    if (!ordersTable) {
        await knex.schema.createTable('orders', (table) => {
            table.bigIncrements('id').notNullable();
            table.integer('user_id');
            table.integer('number');
            table.text('status');
            table.timestamp('completed_at');
            table.timestamp('created_at');
            table.integer('product_id');
        });
    }

    let productCategoriesTable = await knex.schema.hasTable('product_categories');
    if (!productCategoriesTable) {
        await knex.schema.createTable('product_categories', (table) => {
            table.bigIncrements('id').notNullable();
            table.timestamp('created_at');
            table.text('name');
        });
    }

    const productsTable = await knex.schema.hasTable('products');
    if (!productsTable) {
        await knex.schema.createTable('products', (table) => {
            table.bigIncrements('id').notNullable();
            table.text('name');
            table.text('description');
            table.timestamp('created_at');
            table.integer('supplier_id');
            table.integer('product_category_id');
        });
    }

    const suppliersTable = await knex.schema.hasTable('suppliers');
    if (!suppliersTable) {
        await knex.schema.createTable('suppliers', (table) => {
            table.bigIncrements('id').notNullable();
            table.string('address', 255).defaultTo('');
            table.string('email', 255).defaultTo('');
            table.timestamp('created_at');
            table.string('company', 255);
        });
    }

    const usersTable = await knex.schema.hasTable('users');
    if (!usersTable) {
        await knex.schema.createTable('users', (table) => {
            table.bigIncrements('id').notNullable();
            table.string('city', 255);
            table.integer('age')
            table.string('company', 255).defaultTo('');
            table.text('gender');
            table.timestamp('created_at');
            table.string('first_name', 255);
            table.string('last_name', 255);
        });
    }
}

export async function down(knex: Knex): Promise<any> {
    knex.client.dialect = 'mysql';
    
    const database = knex.client.config.connection.database;

    console.log(`## Dropping Tables In ${database} ##`);
    for (var i = 0; i < initTables.length; i++) {
        let tableName = initTables[i];
        let table = await knex.schema.hasTable(tableName);
        if (table) {
            await knex.schema.dropTable(tableName);
            console.log(`\tDropped ${tableName}`);
        }
    }
}