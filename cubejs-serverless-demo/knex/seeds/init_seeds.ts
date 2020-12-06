import * as Knex from "knex";

const LINE_ITEMS = require('../seedData/line_items.json');
const ORDERS = require('../seedData/orders.json');
const PRODUCT_CATEGORIES = require('../seedData/product_categories.json');
const PRODUCTS = require('../seedData/products.json');
const SUPPLIERS = require('../seedData/suppliers.json');
const USERS = require('../seedData/users.json');

export async function seed(knex: Knex): Promise<any> {
    console.log('Seeding line_items:', LINE_ITEMS.length);
    await knex('line_items').del()
        .then(async () => {
            await insertSplits('line_items', LINE_ITEMS, knex);
        });

    console.log('Seeding orders:', ORDERS.length);
    await knex('orders').del()
        .then(async () => {
            await insertSplits('orders', ORDERS, knex);
        });

    console.log('Seeding product_categories:', PRODUCT_CATEGORIES.length);
    await knex('product_categories').del()
        .then(async () => {
            await insertSplits('product_categories', PRODUCT_CATEGORIES, knex);
        });

    console.log('Seeding products:', PRODUCTS.length);
    await knex('products').del()
        .then(async () => {
            await insertSplits('products', PRODUCTS, knex);
        });

    console.log('Seeding suppliers:', SUPPLIERS.length);
    await knex('suppliers').del()
        .then(async () => {
            await insertSplits('suppliers', SUPPLIERS, knex);
        })

    console.log('Seeding users:', USERS.length);
    await knex('users').del()
        .then(async () => {
            await insertSplits('users', USERS, knex);
        })
};

async function insertSplits(tableName: string, dataArray: any[], knex: Knex) {
    const splits = Math.ceil(dataArray.length / 1000);
    const sliceSize = Math.ceil(dataArray.length / splits);
    let startSlice = 0;
    let endSlice = sliceSize;
    for (var i = 0; i < splits; i++) {
        const items = dataArray.slice(startSlice, endSlice);
        console.log(`Slice ${i} has ${items.length} items`);

        await knex(tableName).insert(items);

        startSlice += sliceSize
        endSlice += sliceSize
    }
}