/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      items {
        id
        enabled
        status
        email
        name
        email_verified
        phone_number
        phone_number_verified
        createdAt
        updatedAt
        sub
      }
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      enabled
      status
      email
      name
      email_verified
      phone_number
      phone_number_verified
      createdAt
      updatedAt
      sub
    }
  }
`;
export const getCubejsDashboardItem = /* GraphQL */ `
  query GetCubejsDashboardItem($id: ID!) {
    getCubejsDashboardItem(id: $id) {
      id
      userID
      layout
      vizState
      name
      createdAt
      updatedAt
    }
  }
`;
export const listCubejsDashboardItems = /* GraphQL */ `
  query ListCubejsDashboardItems(
    $filter: ModelCubejsDashboardItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCubejsDashboardItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        layout
        vizState
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listUserDashboardItems = /* GraphQL */ `
  query ListUserDashboardItems(
    $userID: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCubejsDashboardItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserDashboardItems(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        layout
        vizState
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
