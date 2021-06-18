import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  name: Scalars['String'];
  subCategories?: Maybe<Array<Category>>;
};

export type CategoryInput = {
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
};

export type ContactData = {
  __typename?: 'ContactData';
  id: Scalars['ID'];
  value?: Maybe<Scalars['String']>;
};

export type ContactInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  issue: Scalars['String'];
  content: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  path: Scalars['String'];
  fileName: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  jwt: Scalars['String'];
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  addImageToProject: Project;
  setPortraitToProject: Project;
  removeImageFromProject: Scalars['ID'];
  removeImagesFromProject: Array<Scalars['ID']>;
  updateProject: Project;
  deleteProject: Scalars['ID'];
  deleteProjects: Array<Scalars['ID']>;
  createCategory: Category;
  register: User;
  login: LoginResult;
  changeRole: User;
  changeUserPasswordByAdmin: Scalars['Boolean'];
  changeUserPasswordByUser: Scalars['Boolean'];
  updateUserByAdmin: User;
  updateUserByUser: User;
  deleteUser: Scalars['ID'];
  deleteUsers: Array<Scalars['ID']>;
  logout: Scalars['ID'];
  forgotPassword: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  updateSection: Section;
  sendEmail: Scalars['Boolean'];
  updateData: ContactData;
};


export type MutationCreateProjectArgs = {
  input: ProjectInput;
};


export type MutationAddImageToProjectArgs = {
  files: Array<Scalars['Upload']>;
  id: Scalars['ID'];
};


export type MutationSetPortraitToProjectArgs = {
  projectId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationRemoveImageFromProjectArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveImagesFromProjectArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationUpdateProjectArgs = {
  input: ProjectInput;
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationChangeRoleArgs = {
  id: Scalars['ID'];
};


export type MutationChangeUserPasswordByAdminArgs = {
  confirmPassword: Scalars['String'];
  password: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationChangeUserPasswordByUserArgs = {
  confirmPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateUserByAdminArgs = {
  input: UserInput;
  id: Scalars['ID'];
};


export type MutationUpdateUserByUserArgs = {
  input: UserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUpdateSectionArgs = {
  contenido?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
  id: Scalars['ID'];
};


export type MutationSendEmailArgs = {
  input: ContactInput;
};


export type MutationUpdateDataArgs = {
  value: Scalars['String'];
  id: Scalars['ID'];
};

export type PaginatedProjects = {
  __typename?: 'PaginatedProjects';
  projects: Array<Project>;
  hasMore: Scalars['Boolean'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  surface: Scalars['Int'];
  year: Scalars['String'];
  location: Scalars['String'];
  description: Scalars['String'];
  categories: Array<Category>;
  mainCategory?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Image>>;
  portraitId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ProjectInput = {
  name: Scalars['String'];
  surface: Scalars['Int'];
  year: Scalars['String'];
  location: Scalars['String'];
  description: Scalars['String'];
  categories: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  projects: Array<Project>;
  latestProjects: Array<Project>;
  projectsByCat: PaginatedProjects;
  project: Project;
  categories: Array<Category>;
  flatCategories: Array<Category>;
  getUser: User;
  getUsers: Array<User>;
  getRoles: Array<Role>;
  section: Section;
  sections: Array<Section>;
  getData: Array<ContactData>;
};


export type QueryProjectsByCatArgs = {
  filter?: Maybe<Array<Scalars['String']>>;
  cursor?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  category: Scalars['String'];
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QuerySectionArgs = {
  id: Scalars['ID'];
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastname: Scalars['String'];
  role: Scalars['ID'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  description: Scalars['String'];
};

export type Section = {
  __typename?: 'Section';
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  contenido?: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  name: Scalars['String'];
  lastname: Scalars['String'];
  role: Role;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  lastname: Scalars['String'];
  role: Scalars['ID'];
};

export type AddImageToProjectMutationVariables = Exact<{
  id: Scalars['ID'];
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type AddImageToProjectMutation = (
  { __typename?: 'Mutation' }
  & { addImageToProject: (
    { __typename: 'Project' }
    & Pick<Project, 'id' | 'name'>
    & { images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path' | 'fileName' | 'createdAt'>
    )>> }
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type ChangePasswordByAdminMutationVariables = Exact<{
  id: Scalars['ID'];
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
}>;


export type ChangePasswordByAdminMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeUserPasswordByAdmin'>
);

export type ChangePasswordByUserMutationVariables = Exact<{
  password: Scalars['String'];
  confirmPassword: Scalars['String'];
}>;


export type ChangePasswordByUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeUserPasswordByUser'>
);

export type ChangeRoleMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChangeRoleMutation = (
  { __typename?: 'Mutation' }
  & { changeRole: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'id' | 'description'>
    ) }
  ) }
);

export type CreateProjectMutationVariables = Exact<{
  input: ProjectInput;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'surface' | 'year' | 'location' | 'description' | 'createdAt' | 'updatedAt'>
    & { categories: Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    )>, images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path'>
    )>> }
  ) }
);

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteImageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeImageFromProject'>
);

export type DeleteImagesMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteImagesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeImagesFromProject'>
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProject'>
);

export type DeleteProjectsMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteProjectsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteProjects'>
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type DeleteUsersMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteUsersMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUsers'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResult' }
    & Pick<LoginResult, 'jwt' | 'userId'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname' | 'createdAt'>
  ) }
);

export type SendContactEmailMutationVariables = Exact<{
  input: ContactInput;
}>;


export type SendContactEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendEmail'>
);

export type SetAsPortraitMutationVariables = Exact<{
  id: Scalars['ID'];
  projectId: Scalars['ID'];
}>;


export type SetAsPortraitMutation = (
  { __typename?: 'Mutation' }
  & { setPortraitToProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'portraitId' | 'createdAt' | 'updatedAt'>
    & { images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path'>
    )>> }
  ) }
);

export type UpdateContactDataMutationVariables = Exact<{
  id: Scalars['ID'];
  value: Scalars['String'];
}>;


export type UpdateContactDataMutation = (
  { __typename?: 'Mutation' }
  & { updateData: (
    { __typename?: 'ContactData' }
    & Pick<ContactData, 'id' | 'value'>
  ) }
);

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProjectInput;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'surface' | 'year' | 'location' | 'description' | 'portraitId' | 'createdAt' | 'updatedAt'>
    & { categories: Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    )>, images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path'>
    )>> }
  ) }
);

export type UpdateSectionMutationVariables = Exact<{
  id: Scalars['ID'];
  file?: Maybe<Scalars['Upload']>;
  contenido?: Maybe<Scalars['String']>;
}>;


export type UpdateSectionMutation = (
  { __typename?: 'Mutation' }
  & { updateSection: (
    { __typename?: 'Section' }
    & Pick<Section, 'id' | 'img' | 'contenido'>
  ) }
);

export type UpdateUserByAdminMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UserInput;
}>;


export type UpdateUserByAdminMutation = (
  { __typename?: 'Mutation' }
  & { updateUserByAdmin: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'id' | 'description'>
    ) }
  ) }
);

export type UpdateUserByUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type UpdateUserByUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUserByUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'id' | 'description'>
    ) }
  ) }
);

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = (
  { __typename?: 'Query' }
  & { categories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
    & { subCategories?: Maybe<Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
      & { subCategories?: Maybe<Array<(
        { __typename?: 'Category' }
        & Pick<Category, 'id' | 'name'>
      )>> }
    )>> }
  )> }
);

export type GetContactDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetContactDataQuery = (
  { __typename?: 'Query' }
  & { getData: Array<(
    { __typename?: 'ContactData' }
    & Pick<ContactData, 'id' | 'value'>
  )> }
);

export type GetLatestProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestProjectsQuery = (
  { __typename?: 'Query' }
  & { latestProjects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'year' | 'portraitId'>
    & { categories: Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    )>, images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path' | 'fileName'>
    )>> }
  )> }
);

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'location' | 'description' | 'surface' | 'year' | 'createdAt'>
    & { categories: Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    )>, images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path'>
    )>> }
  ) }
);

export type GetProjectImagesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProjectImagesQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path' | 'fileName' | 'createdAt'>
    )>> }
  ) }
);

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'location' | 'description' | 'surface' | 'year' | 'portraitId' | 'createdAt' | 'updatedAt'>
    & { categories: Array<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    )>, images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path' | 'fileName'>
    )>> }
  )> }
);

export type GetProjectsByCatQueryVariables = Exact<{
  category: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
  filter?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type GetProjectsByCatQuery = (
  { __typename?: 'Query' }
  & { projectsByCat: (
    { __typename?: 'PaginatedProjects' }
    & Pick<PaginatedProjects, 'hasMore'>
    & { projects: Array<(
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'mainCategory' | 'name' | 'location' | 'description' | 'surface' | 'year' | 'portraitId' | 'createdAt' | 'updatedAt'>
      & { categories: Array<(
        { __typename?: 'Category' }
        & Pick<Category, 'id' | 'name'>
      )>, images?: Maybe<Array<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'path' | 'fileName'>
      )>> }
    )> }
  ) }
);

export type GetProjectsImageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsImageQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'portraitId'>
    & { images?: Maybe<Array<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'path' | 'fileName' | 'createdAt'>
    )>> }
  )> }
);

export type GetProjectsNamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsNamesQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name'>
  )> }
);

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = (
  { __typename?: 'Query' }
  & { getRoles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'description'>
  )> }
);

export type GetSectionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetSectionQuery = (
  { __typename?: 'Query' }
  & { section: (
    { __typename?: 'Section' }
    & Pick<Section, 'id' | 'img' | 'contenido'>
  ) }
);

export type GetSectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSectionsQuery = (
  { __typename?: 'Query' }
  & { sections: Array<(
    { __typename?: 'Section' }
    & Pick<Section, 'id' | 'img' | 'contenido'>
  )> }
);

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname' | 'createdAt' | 'updatedAt'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'id' | 'description'>
    ) }
  ) }
);

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { getUsers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'name' | 'lastname'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'id' | 'description'>
    ) }
  )> }
);


export const AddImageToProjectDocument = gql`
    mutation AddImageToProject($id: ID!, $files: [Upload!]!) {
  addImageToProject(id: $id, files: $files) {
    id
    name
    images {
      id
      path
      fileName
      createdAt
    }
    __typename
  }
}
    `;

export function useAddImageToProjectMutation() {
  return Urql.useMutation<AddImageToProjectMutation, AddImageToProjectMutationVariables>(AddImageToProjectDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $password: String!) {
  changePassword(token: $token, newPassword: $password)
}
    `;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ChangePasswordByAdminDocument = gql`
    mutation ChangePasswordByAdmin($id: ID!, $password: String!, $confirmPassword: String!) {
  changeUserPasswordByAdmin(
    id: $id
    password: $password
    confirmPassword: $confirmPassword
  )
}
    `;

export function useChangePasswordByAdminMutation() {
  return Urql.useMutation<ChangePasswordByAdminMutation, ChangePasswordByAdminMutationVariables>(ChangePasswordByAdminDocument);
};
export const ChangePasswordByUserDocument = gql`
    mutation ChangePasswordByUser($password: String!, $confirmPassword: String!) {
  changeUserPasswordByUser(password: $password, confirmPassword: $confirmPassword)
}
    `;

export function useChangePasswordByUserMutation() {
  return Urql.useMutation<ChangePasswordByUserMutation, ChangePasswordByUserMutationVariables>(ChangePasswordByUserDocument);
};
export const ChangeRoleDocument = gql`
    mutation ChangeRole($id: ID!) {
  changeRole(id: $id) {
    id
    email
    name
    lastname
    role {
      id
      description
    }
  }
}
    `;

export function useChangeRoleMutation() {
  return Urql.useMutation<ChangeRoleMutation, ChangeRoleMutationVariables>(ChangeRoleDocument);
};
export const CreateProjectDocument = gql`
    mutation CreateProject($input: ProjectInput!) {
  createProject(input: $input) {
    id
    name
    surface
    year
    location
    description
    categories {
      id
      name
    }
    images {
      id
      path
    }
    createdAt
    updatedAt
  }
}
    `;

export function useCreateProjectMutation() {
  return Urql.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument);
};
export const DeleteImageDocument = gql`
    mutation DeleteImage($id: ID!) {
  removeImageFromProject(id: $id)
}
    `;

export function useDeleteImageMutation() {
  return Urql.useMutation<DeleteImageMutation, DeleteImageMutationVariables>(DeleteImageDocument);
};
export const DeleteImagesDocument = gql`
    mutation DeleteImages($ids: [ID!]!) {
  removeImagesFromProject(ids: $ids)
}
    `;

export function useDeleteImagesMutation() {
  return Urql.useMutation<DeleteImagesMutation, DeleteImagesMutationVariables>(DeleteImagesDocument);
};
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
    `;

export function useDeleteProjectMutation() {
  return Urql.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument);
};
export const DeleteProjectsDocument = gql`
    mutation DeleteProjects($ids: [ID!]!) {
  deleteProjects(ids: $ids)
}
    `;

export function useDeleteProjectsMutation() {
  return Urql.useMutation<DeleteProjectsMutation, DeleteProjectsMutationVariables>(DeleteProjectsDocument);
};
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument);
};
export const DeleteUsersDocument = gql`
    mutation DeleteUsers($ids: [ID!]!) {
  deleteUsers(ids: $ids)
}
    `;

export function useDeleteUsersMutation() {
  return Urql.useMutation<DeleteUsersMutation, DeleteUsersMutationVariables>(DeleteUsersDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    jwt
    userId
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    email
    name
    lastname
    createdAt
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SendContactEmailDocument = gql`
    mutation SendContactEmail($input: ContactInput!) {
  sendEmail(input: $input)
}
    `;

export function useSendContactEmailMutation() {
  return Urql.useMutation<SendContactEmailMutation, SendContactEmailMutationVariables>(SendContactEmailDocument);
};
export const SetAsPortraitDocument = gql`
    mutation SetAsPortrait($id: ID!, $projectId: ID!) {
  setPortraitToProject(id: $id, projectId: $projectId) {
    id
    name
    portraitId
    images {
      id
      path
    }
    createdAt
    updatedAt
  }
}
    `;

export function useSetAsPortraitMutation() {
  return Urql.useMutation<SetAsPortraitMutation, SetAsPortraitMutationVariables>(SetAsPortraitDocument);
};
export const UpdateContactDataDocument = gql`
    mutation UpdateContactData($id: ID!, $value: String!) {
  updateData(id: $id, value: $value) {
    id
    value
  }
}
    `;

export function useUpdateContactDataMutation() {
  return Urql.useMutation<UpdateContactDataMutation, UpdateContactDataMutationVariables>(UpdateContactDataDocument);
};
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: ID!, $input: ProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    surface
    year
    location
    description
    portraitId
    categories {
      id
      name
    }
    images {
      id
      path
    }
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateProjectMutation() {
  return Urql.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument);
};
export const UpdateSectionDocument = gql`
    mutation UpdateSection($id: ID!, $file: Upload, $contenido: String) {
  updateSection(id: $id, file: $file, contenido: $contenido) {
    id
    img
    contenido
  }
}
    `;

export function useUpdateSectionMutation() {
  return Urql.useMutation<UpdateSectionMutation, UpdateSectionMutationVariables>(UpdateSectionDocument);
};
export const UpdateUserByAdminDocument = gql`
    mutation UpdateUserByAdmin($id: ID!, $input: UserInput!) {
  updateUserByAdmin(id: $id, input: $input) {
    id
    email
    name
    lastname
    role {
      id
      description
    }
  }
}
    `;

export function useUpdateUserByAdminMutation() {
  return Urql.useMutation<UpdateUserByAdminMutation, UpdateUserByAdminMutationVariables>(UpdateUserByAdminDocument);
};
export const UpdateUserByUserDocument = gql`
    mutation UpdateUserByUser($input: UserInput!) {
  updateUserByUser(input: $input) {
    id
    email
    name
    lastname
    role {
      id
      description
    }
  }
}
    `;

export function useUpdateUserByUserMutation() {
  return Urql.useMutation<UpdateUserByUserMutation, UpdateUserByUserMutationVariables>(UpdateUserByUserDocument);
};
export const GetCategoriesDocument = gql`
    query GetCategories {
  categories {
    id
    name
    subCategories {
      id
      name
      subCategories {
        id
        name
      }
    }
  }
}
    `;

export function useGetCategoriesQuery(options: Omit<Urql.UseQueryArgs<GetCategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCategoriesQuery>({ query: GetCategoriesDocument, ...options });
};
export const GetContactDataDocument = gql`
    query GetContactData {
  getData {
    id
    value
  }
}
    `;

export function useGetContactDataQuery(options: Omit<Urql.UseQueryArgs<GetContactDataQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetContactDataQuery>({ query: GetContactDataDocument, ...options });
};
export const GetLatestProjectsDocument = gql`
    query GetLatestProjects {
  latestProjects {
    id
    year
    categories {
      id
      name
    }
    portraitId
    images {
      id
      path
      fileName
    }
  }
}
    `;

export function useGetLatestProjectsQuery(options: Omit<Urql.UseQueryArgs<GetLatestProjectsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLatestProjectsQuery>({ query: GetLatestProjectsDocument, ...options });
};
export const GetProjectDocument = gql`
    query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    location
    description
    surface
    year
    categories {
      id
      name
    }
    createdAt
    images {
      id
      path
    }
  }
}
    `;

export function useGetProjectQuery(options: Omit<Urql.UseQueryArgs<GetProjectQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectQuery>({ query: GetProjectDocument, ...options });
};
export const GetProjectImagesDocument = gql`
    query GetProjectImages($id: ID!) {
  project(id: $id) {
    id
    images {
      id
      path
      fileName
      createdAt
    }
  }
}
    `;

export function useGetProjectImagesQuery(options: Omit<Urql.UseQueryArgs<GetProjectImagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectImagesQuery>({ query: GetProjectImagesDocument, ...options });
};
export const GetProjectsDocument = gql`
    query GetProjects {
  projects {
    id
    name
    location
    description
    surface
    year
    categories {
      id
      name
    }
    portraitId
    createdAt
    updatedAt
    images {
      id
      path
      fileName
    }
  }
}
    `;

export function useGetProjectsQuery(options: Omit<Urql.UseQueryArgs<GetProjectsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectsQuery>({ query: GetProjectsDocument, ...options });
};
export const GetProjectsByCatDocument = gql`
    query GetProjectsByCat($category: String!, $limit: Int, $cursor: String, $filter: [String!]) {
  projectsByCat(
    category: $category
    limit: $limit
    cursor: $cursor
    filter: $filter
  ) {
    hasMore
    projects {
      id
      mainCategory
      name
      location
      description
      surface
      year
      categories {
        id
        name
      }
      portraitId
      createdAt
      updatedAt
      images {
        id
        path
        fileName
      }
    }
  }
}
    `;

export function useGetProjectsByCatQuery(options: Omit<Urql.UseQueryArgs<GetProjectsByCatQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectsByCatQuery>({ query: GetProjectsByCatDocument, ...options });
};
export const GetProjectsImageDocument = gql`
    query GetProjectsImage {
  projects {
    id
    name
    portraitId
    images {
      id
      path
      fileName
      createdAt
    }
  }
}
    `;

export function useGetProjectsImageQuery(options: Omit<Urql.UseQueryArgs<GetProjectsImageQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectsImageQuery>({ query: GetProjectsImageDocument, ...options });
};
export const GetProjectsNamesDocument = gql`
    query getProjectsNames {
  projects {
    id
    name
  }
}
    `;

export function useGetProjectsNamesQuery(options: Omit<Urql.UseQueryArgs<GetProjectsNamesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetProjectsNamesQuery>({ query: GetProjectsNamesDocument, ...options });
};
export const GetRolesDocument = gql`
    query GetRoles {
  getRoles {
    id
    description
  }
}
    `;

export function useGetRolesQuery(options: Omit<Urql.UseQueryArgs<GetRolesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetRolesQuery>({ query: GetRolesDocument, ...options });
};
export const GetSectionDocument = gql`
    query GetSection($id: ID!) {
  section(id: $id) {
    id
    img
    contenido
  }
}
    `;

export function useGetSectionQuery(options: Omit<Urql.UseQueryArgs<GetSectionQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSectionQuery>({ query: GetSectionDocument, ...options });
};
export const GetSectionsDocument = gql`
    query GetSections {
  sections {
    id
    img
    contenido
  }
}
    `;

export function useGetSectionsQuery(options: Omit<Urql.UseQueryArgs<GetSectionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSectionsQuery>({ query: GetSectionsDocument, ...options });
};
export const GetUserDocument = gql`
    query GetUser {
  getUser {
    id
    email
    name
    lastname
    role {
      id
      description
    }
    createdAt
    updatedAt
  }
}
    `;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};
export const GetUsersDocument = gql`
    query GetUsers {
  getUsers {
    id
    email
    name
    lastname
    role {
      id
      description
    }
  }
}
    `;

export function useGetUsersQuery(options: Omit<Urql.UseQueryArgs<GetUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUsersQuery>({ query: GetUsersDocument, ...options });
};