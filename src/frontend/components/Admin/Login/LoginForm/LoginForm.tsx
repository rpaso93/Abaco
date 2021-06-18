import { OperationResult } from '@urql/core';
import { Form, Formik } from 'formik';
import { Button, Form as AntdForm, Divider, Typography } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import {
  Exact,
  LoginInput,
  LoginMutation,
  useLoginMutation,
} from '../../../../generated/graphql';
import { setExpDate, setToken } from '../../../../../utils/local';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import styles from './LoginForm.module.css';
import Input from '../../../UI/FormFields/Input';
import { loginSchema } from '../../../../../utils/validations';

interface LoginFormProps {
  login: Dispatch<SetStateAction<boolean>>;
  autoLogout: (milliseconds: any) => void;
  forgotPass: Dispatch<SetStateAction<boolean>>;
}

const FormItem = AntdForm.Item;
const { Title } = Typography;

const LoginForm: React.FC<LoginFormProps> = ({
  login,
  autoLogout,
  forgotPass,
}) => {
  const [, loginMutation] = useLoginMutation();

  const loginHandler = ({
    data,
  }: OperationResult<LoginMutation, Exact<{ input: LoginInput }>>): void => {
    setToken(data.login.jwt);
    const remainingMilliseconds = 7200000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    setExpDate(expiryDate);
    autoLogout(remainingMilliseconds);
    login(true);
  };

  const changeToForgot = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    forgotPass(false);
  };

  return (
    <Formik
      initialValues={{ input: { email: '', password: '' } }}
      onSubmit={async (values, { setErrors }) => {
        const result = await loginMutation(values);
        if (result.error) {
          setErrors({
            input: {
              email: '\n',
              password: 'El usuario o contraseña ingresado es invalido',
            },
          });
          return;
        }
        loginHandler(result);
      }}
      validationSchema={loginSchema}
      validateOnBlur
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.Form}>
          <Title level={5}>Administración</Title>
          <Divider className={styles.Divider} />
          <Input
            name="input.email"
            email
            type="input"
            prefix={<UserOutlined />}
            className={styles.InputWidth}
            error={errors?.input?.email}
            touched={touched?.input?.email}
            required
          />
          <Input
            name="input.password"
            type="password"
            prefix={<LockOutlined />}
            className={styles.InputWidth}
            error={errors?.input?.password}
            touched={touched?.input?.password}
            required
          />
          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              icon={<LoginOutlined />}
            >
              Iniciar Sesion
            </Button>
          </FormItem>
          <span>
            <a href="" onClick={e => changeToForgot(e)}>
              Olvidaste tu contraseña?
            </a>
          </span>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
