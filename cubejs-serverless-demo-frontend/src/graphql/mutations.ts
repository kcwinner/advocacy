/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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
export const createCubejsDashboardItem = /* GraphQL */ `
  mutation CreateCubejsDashboardItem($input: CreateCubejsDashboardItemInput!) {
    createCubejsDashboardItem(input: $input) {
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
export const updateCubejsDashboardItem = /* GraphQL */ `
  mutation UpdateCubejsDashboardItem($input: UpdateCubejsDashboardItemInput!) {
    updateCubejsDashboardItem(input: $input) {
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
export const deleteCubejsDashboardItem = /* GraphQL */ `
  mutation DeleteCubejsDashboardItem($input: DeleteCubejsDashboardItemInput!) {
    deleteCubejsDashboardItem(input: $input) {
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
