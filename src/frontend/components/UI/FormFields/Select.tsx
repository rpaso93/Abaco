import React from 'react';
import { Field, FormikErrors, FormikTouched } from 'formik';
import {
  ColProps,
  Form as AntdForm,
  Select as AntdSelect,
  Tag,
  TreeSelect,
  Typography,
} from 'antd';
import { Category, Project, Role } from '../../../generated/graphql';

const FormItem = AntdForm.Item;
const { OptGroup, Option } = AntdSelect;
const { TreeNode } = TreeSelect;
const { Text } = Typography;

interface SelectProps {
  data:
    | Category[]
    | Role[]
    | ({
        __typename?: 'Project';
      } & Pick<Project, 'id' | 'name'>)[];
  setField: (field: string, value: any, shouldValidate?: boolean) => void;
  name: string;
  label: string;
  multiple?: boolean;
  type: 'categories' | 'roles' | 'projects';
  labelCol: ColProps;
  wrapperCol: ColProps;
  required?: boolean;
  error: string | string[] | FormikErrors<any>[] | undefined;
  touched: boolean | FormikTouched<any>[];
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  multiple,
  data,
  setField,
  labelCol,
  wrapperCol,
  required,
  error,
  touched,
  type: FieldType,
}) => {
  return (
    <FormItem
      label={label}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      required={required}
      validateStatus={error && touched ? 'error' : 'success'}
    >
      <Field name={name}>
        {({ field }) => (
          <>
            {multiple ? (
              <TreeSelect
                {...field}
                showArrow
                showSearch={false}
                multiple
                tagRender={tagRender}
                onChange={e => {
                  setField(name, e);
                }}
              >
                {data.map(category =>
                  category.subCategories.length > 0
                    ? toNestedTreeNode(category)
                    : toTreeNode(category)
                )}
              </TreeSelect>
            ) : FieldType === 'roles' ? (
              <AntdSelect
                {...field}
                showArrow
                showSearch={false}
                onChange={e => {
                  setField(name, e);
                }}
              >
                {data.map(role => (
                  <Option key={role.id} value={role.id}>
                    {role.description === 'sub_admin'
                      ? 'Sub Administrador'
                      : 'Sólo Proyectos'}
                  </Option>
                ))}
              </AntdSelect>
            ) : (
              <AntdSelect
                {...field}
                showArrow
                showSearch={false}
                onChange={e => {
                  setField(name, e);
                }}
              >
                {data.map(project => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </AntdSelect>
            )}
            {error && touched ? (
              <Text type="danger" style={{ padding: 5 }}>
                {error}
              </Text>
            ) : null}
          </>
        )}
      </Field>
    </FormItem>
  );
};

export default Select;

const tagRender = (props: {
  label: any;
  closable: any;
  onClose: any;
}): JSX.Element => {
  const { label, closable, onClose } = props;
  return (
    <Tag
      color="#108ee9"
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const toOptGroup = (category: Category): JSX.Element => {
  return (
    <OptGroup label={category.name} key={category.id}>
      {category.subCategories?.map(subCategory => toOptions(subCategory))}
    </OptGroup>
  );
};

const toOptions = (category: Category): JSX.Element => {
  return (
    <Option value={category.id} key={category.id}>
      {category.name}
    </Option>
  );
};

const toTreeNode = (category: Category) => {
  return (
    <TreeNode value={category.id} key={category.id} title={category.name} />
  );
};

const toNestedTreeNode = (category: Category): JSX.Element => {
  return (
    <TreeNode title={category.name} key={category.id} value={category.id}>
      {category.subCategories?.map(subCategory =>
        subCategory.subCategories?.length > 0
          ? toNestedTreeNode(subCategory)
          : toTreeNode(subCategory)
      )}
    </TreeNode>
  );
};
