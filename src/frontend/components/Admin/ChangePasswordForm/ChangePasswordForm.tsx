import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { Button, Form as AntdForm, Divider, Typography } from 'antd';
import { LockOutlined, LoginOutlined } from '@ant-design/icons';
import Input from '../../UI/FormFields/Input';
import styles from '../Login/LoginForm/LoginForm.module.css';
import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../../generated/graphql';

const FormItem = AntdForm.Item;
const { Title } = Typography;

const ChangePasswordForm: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState(false);

  return !tokenError ? (
    <Formik
      initialValues={{ password: '' }}
      onSubmit={async values => {
        const result = await changePassword({
          password: values.password,
          token:
            typeof router.query.token === 'string' ? router.query.token : '',
        });
        if (result.error) {
          setTokenError(true);
          return;
        }
        router.push('/admin');
      }}
      validateOnBlur
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.Form}>
          <Title level={5}>Ingresa tu nueva contraseña</Title>
          <Divider className={styles.Divider} />
          <Input
            name="password"
            type="password"
            prefix={<LockOutlined />}
            className={styles.InputWidth}
            error={errors?.password}
            touched={touched?.password}
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
              Confirmar
            </Button>
          </FormItem>
        </Form>
      )}
    </Formik>
  ) : (
    <div className={styles.Form}>El token es invalido, consiga uno nuevo.</div>
  );
};

export default ChangePasswordForm;
