import { CheckOutlined } from '@ant-design/icons';
import { Button, Form as AntdForm } from 'antd';
import { Form, Formik } from 'formik';
import React from 'react';
import { OperationResult } from 'urql';
import {
  userSchema,
  userUpdateSchema,
} from '../../../../../../../utils/validations';
import {
  Exact,
  RegisterInput,
  RegisterMutation,
  UpdateUserByAdminMutation,
  useGetRolesQuery,
  User,
  useRegisterMutation,
  UserInput,
  useUpdateUserByAdminMutation,
  useUpdateUserByUserMutation,
} from '../../../../../../generated/graphql';
import Input from '../../../../../UI/FormFields/Input';
import Select from '../../../../../UI/FormFields/Select';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';

interface UserAddOrEditProps {
  user: User | null;
  setUser?: React.Dispatch<React.SetStateAction<User>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

const FormItem = AntdForm.Item;

const labelCol = { span: 7 };
const wrapperCol = { span: 14 };

const UserAddOrEdit: React.FC<UserAddOrEditProps> = ({
  user,
  setUser,
  setVisible,
  isAdmin,
}) => {
  const [, register] = useRegisterMutation();
  const [, updateByAdmin] = useUpdateUserByAdminMutation();
  const [, updateByUser] = useUpdateUserByUserMutation();
  const [{ data: rolesData }] = useGetRolesQuery({
    requestPolicy: 'cache-and-network',
  });

  let initialValues: any = {
    input: {
      email: '',
      name: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
  };
  let schema: any = userSchema;

  if (user) {
    initialValues = {
      input: {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        role: user.role.id,
      },
    };
    schema = userUpdateSchema;
  }

  const submitUser = async values => {
    const response = user
      ? isAdmin
        ? await updateByAdmin({ id: user.id, input: values.input })
        : await updateByUser(values)
      : await register(values);

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        isAdmin
          ? `El usuario no pudo ser ${
              user ? 'actualizado' : 'creado'
            }. ERROR: ${response.error.message}.`
          : 'Tu cuenta no ha podido ser modificada'
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Edición Completa',
        isAdmin
          ? user
            ? `El usuario con nombre '${
                (
                  response as OperationResult<
                    UpdateUserByAdminMutation,
                    Exact<{
                      id: string;
                      input: UserInput;
                    }>
                  >
                ).data.updateUserByAdmin.name
              }' fue actualizado correctamente.`
            : `El usuario con nombre '${
                (
                  response as OperationResult<
                    RegisterMutation,
                    Exact<{
                      input: RegisterInput;
                    }>
                  >
                ).data.register.name
              }' fue creado correctamente.`
          : 'Tu  cuenta ha sido modificada correctamente.'
      );
    }
    if (user && isAdmin) {
      setUser(null);
    }
    setVisible(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={values => submitUser(values)}
      validateOnBlur
    >
      {({ setFieldValue, errors, touched, isSubmitting }) => (
        <Form
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Input
            name="input.email"
            email
            label="E-mail"
            type="input"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.email}
            touched={touched?.input?.email}
          />
          {!user && (
            <>
              <Input
                name="input.password"
                type="password"
                label="Contraseña"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                error={errors?.input?.password}
                touched={touched?.input?.password}
                required
              />
              <Input
                name="input.confirmPassword"
                type="password"
                label="Confirmar contraseña"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                error={errors?.input?.confirmPassword}
                touched={touched?.input?.confirmPassword}
                required
              />
            </>
          )}
          <Input
            name="input.name"
            label="Nombre"
            type="input"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.name}
            touched={touched?.input?.name}
          />
          <Input
            name="input.lastname"
            label="Apellido"
            type="input"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.lastname}
            touched={touched?.input?.lastname}
          />
          {isAdmin && rolesData?.getRoles && (
            <Select
              name="input.role"
              label="Rol de Usuario"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              required
              setField={setFieldValue}
              data={rolesData.getRoles}
              error={errors?.input?.role}
              touched={touched?.input?.role}
              type="roles"
            />
          )}
          <FormItem style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={<CheckOutlined />}
            >
              {user ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </FormItem>
        </Form>
      )}
    </Formik>
  );
};

export default UserAddOrEdit;
