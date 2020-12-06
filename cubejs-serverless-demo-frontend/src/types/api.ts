export type Maybe<T> = T | null | undefined;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  AWSDateTime: string,
  AWSDate: string,
  AWSTime: string,
  AWSTimestamp: number,
  AWSEmail: string,
  AWSJSON: string,
  AWSURL: string,
  AWSPhone: string,
  AWSIPAddress: string,
};

export type CreateCubejsDashboardItemInput = {
  id?: Maybe<Scalars['ID']>,
  userID?: Maybe<Scalars['ID']>,
  layout?: Maybe<Scalars['String']>,
  vizState?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};

export type CreateUserInput = {
  email: Scalars['String'],
  name: Scalars['String'],
  type: UserType,
};

export type CubejsDashboardItem = {
   __typename?: 'CubejsDashboardItem',
  id: Scalars['ID'],
  userID?: Maybe<Scalars['ID']>,
  layout?: Maybe<Scalars['String']>,
  vizState?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  createdAt: Scalars['AWSDateTime'],
  updatedAt: Scalars['AWSDateTime'],
};

export type DeleteCubejsDashboardItemInput = {
  id?: Maybe<Scalars['ID']>,
};

export type ModelBooleanFilterInput = {
  ne?: Maybe<Scalars['Boolean']>,
  eq?: Maybe<Scalars['Boolean']>,
};

export type ModelCubejsDashboardItemConnection = {
   __typename?: 'ModelCubejsDashboardItemConnection',
  items?: Maybe<Array<Maybe<CubejsDashboardItem>>>,
  nextToken?: Maybe<Scalars['String']>,
};

export type ModelCubejsDashboardItemFilterInput = {
  id?: Maybe<ModelIdFilterInput>,
  userID?: Maybe<ModelIdFilterInput>,
  layout?: Maybe<ModelStringFilterInput>,
  vizState?: Maybe<ModelStringFilterInput>,
  name?: Maybe<ModelStringFilterInput>,
  and?: Maybe<Array<Maybe<ModelCubejsDashboardItemFilterInput>>>,
  or?: Maybe<Array<Maybe<ModelCubejsDashboardItemFilterInput>>>,
  not?: Maybe<ModelCubejsDashboardItemFilterInput>,
};

export type ModelFloatFilterInput = {
  ne?: Maybe<Scalars['Float']>,
  eq?: Maybe<Scalars['Float']>,
  le?: Maybe<Scalars['Float']>,
  lt?: Maybe<Scalars['Float']>,
  ge?: Maybe<Scalars['Float']>,
  gt?: Maybe<Scalars['Float']>,
  between?: Maybe<Array<Maybe<Scalars['Float']>>>,
};

export type ModelIdFilterInput = {
  ne?: Maybe<Scalars['ID']>,
  eq?: Maybe<Scalars['ID']>,
  le?: Maybe<Scalars['ID']>,
  lt?: Maybe<Scalars['ID']>,
  ge?: Maybe<Scalars['ID']>,
  gt?: Maybe<Scalars['ID']>,
  contains?: Maybe<Scalars['ID']>,
  notContains?: Maybe<Scalars['ID']>,
  between?: Maybe<Array<Maybe<Scalars['ID']>>>,
  beginsWith?: Maybe<Scalars['ID']>,
};

export type ModelIntFilterInput = {
  ne?: Maybe<Scalars['Int']>,
  eq?: Maybe<Scalars['Int']>,
  le?: Maybe<Scalars['Int']>,
  lt?: Maybe<Scalars['Int']>,
  ge?: Maybe<Scalars['Int']>,
  gt?: Maybe<Scalars['Int']>,
  between?: Maybe<Array<Maybe<Scalars['Int']>>>,
};

export enum ModelSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ModelStringFilterInput = {
  ne?: Maybe<Scalars['String']>,
  eq?: Maybe<Scalars['String']>,
  le?: Maybe<Scalars['String']>,
  lt?: Maybe<Scalars['String']>,
  ge?: Maybe<Scalars['String']>,
  gt?: Maybe<Scalars['String']>,
  contains?: Maybe<Scalars['String']>,
  notContains?: Maybe<Scalars['String']>,
  between?: Maybe<Array<Maybe<Scalars['String']>>>,
  beginsWith?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createUser?: Maybe<User>,
  updateUser?: Maybe<User>,
  createCubejsDashboardItem?: Maybe<CubejsDashboardItem>,
  updateCubejsDashboardItem?: Maybe<CubejsDashboardItem>,
  deleteCubejsDashboardItem?: Maybe<CubejsDashboardItem>,
};


export type MutationCreateUserArgs = {
  input: CreateUserInput
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput
};


export type MutationCreateCubejsDashboardItemArgs = {
  input: CreateCubejsDashboardItemInput
};


export type MutationUpdateCubejsDashboardItemArgs = {
  input: UpdateCubejsDashboardItemInput
};


export type MutationDeleteCubejsDashboardItemArgs = {
  input: DeleteCubejsDashboardItemInput
};

export type Query = {
   __typename?: 'Query',
  listUsers?: Maybe<UserConnection>,
  getUser?: Maybe<User>,
  getCubejsDashboardItem?: Maybe<CubejsDashboardItem>,
  listCubejsDashboardItems?: Maybe<ModelCubejsDashboardItemConnection>,
  listUserDashboardItems?: Maybe<ModelCubejsDashboardItemConnection>,
};


export type QueryGetUserArgs = {
  id: Scalars['ID']
};


export type QueryGetCubejsDashboardItemArgs = {
  id: Scalars['ID']
};


export type QueryListCubejsDashboardItemsArgs = {
  filter?: Maybe<ModelCubejsDashboardItemFilterInput>,
  limit?: Maybe<Scalars['Int']>,
  nextToken?: Maybe<Scalars['String']>
};


export type QueryListUserDashboardItemsArgs = {
  userID?: Maybe<Scalars['ID']>,
  sortDirection?: Maybe<ModelSortDirection>,
  filter?: Maybe<ModelCubejsDashboardItemFilterInput>,
  limit?: Maybe<Scalars['Int']>,
  nextToken?: Maybe<Scalars['String']>
};

export type UpdateCubejsDashboardItemInput = {
  id: Scalars['ID'],
  userID?: Maybe<Scalars['ID']>,
  layout?: Maybe<Scalars['String']>,
  vizState?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};

export type UpdateUserInput = {
  id: Scalars['ID'],
  email?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  number?: Maybe<Scalars['String']>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  enabled: Scalars['Boolean'],
  status: Scalars['String'],
  email: Scalars['String'],
  name: Scalars['String'],
  email_verified?: Maybe<Scalars['String']>,
  phone_number?: Maybe<Scalars['String']>,
  phone_number_verified?: Maybe<Scalars['String']>,
  createdAt: Scalars['AWSDateTime'],
  updatedAt: Scalars['AWSDateTime'],
  sub?: Maybe<Scalars['String']>,
};

export type UserConnection = {
   __typename?: 'UserConnection',
  items?: Maybe<Array<User>>,
};

export enum UserType {
  Admin = 'ADMIN',
  User = 'USER'
}
