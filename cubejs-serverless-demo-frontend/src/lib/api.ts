import { Auth, API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api/lib/types';
import { useMutation, useQuery, QueryResult } from "react-query";
import * as types from '../types';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

// DASHBOARD ITEMS

export async function getUserDashboardItems(_: any, queryArgs: types.QueryListUserDashboardItemsArgs): Promise<Array<types.Maybe<types.CubejsDashboardItem>>> {
    if (!queryArgs || !queryArgs.userID) {
        const user = await Auth.currentUserInfo();
        queryArgs.userID = user.attributes.sub
    }

    const result = await genericQuery(queries.listUserDashboardItems, queryArgs);
    return result.data?.listUserDashboardItems?.items || [];
}

export function GetDashboardItem(queryArgs?: types.QueryGetCubejsDashboardItemArgs): QueryResult<types.CubejsDashboardItem, Error> {
    return useQuery(
        ["cubejsDashboardItem", queryArgs],
        async (_, queryArgs) => {
            const result = await genericQuery(queries.getCubejsDashboardItem, queryArgs);
            return result.data?.getCubejsDashboardItem as types.CubejsDashboardItem;
        }
    );
}

export function CreateDashboardItem() {
    return useMutation(async (input: types.CreateCubejsDashboardItemInput) => {
        const result = await genericMutation(mutations.createCubejsDashboardItem, input);
        return result.data?.createCubejsDashboardItem as types.CubejsDashboardItem;
    });
}

export function UpdateDashboardItem() {
    return useMutation(async (input: types.UpdateCubejsDashboardItemInput) => {
        const result = await genericMutation(mutations.updateCubejsDashboardItem, input);
        return result.data?.updateCubejsDashboardItem as types.CubejsDashboardItem;
    });
}

export function DeleteDashboardItem() {
    return useMutation(async (input: types.DeleteCubejsDashboardItemInput) => {
        await genericMutation(mutations.deleteCubejsDashboardItem, input);
    });
}

// GENERIC UTILITY

async function genericQuery(query: string, queryArgs: any) {
    return await API.graphql(graphqlOperation(query, queryArgs)) as GraphQLResult<types.Query>;
}

async function genericMutation(mutation: string, input: any) {
    return await API.graphql(graphqlOperation(mutation, { input: input })) as GraphQLResult<types.Mutation>;
}