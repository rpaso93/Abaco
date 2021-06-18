import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Form as AntdForm } from 'antd';
import Input from '../../../../../UI/FormFields/Input';
import {
  useChangePasswordByAdminMutation,
  useChangePasswordByUserMutation,
  User,
} from '../../../../../../generated/graphql';
import { CheckOutlined } from '@ant-design/icons';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';
import { passwordSchema } from '../../../../../../../utils/validations';

interface PasswordFormProps {
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormItem = AntdForm.Item;

const labelCol = { span: 8 };
const wrapperCol = { span: 14 };

const initialValues = {
  password: '',
  confirmPassword: '',
};

const PasswordForm: React.FC<PasswordFormProps> = ({
  user,
  setUser,
  setVisible,
}) => {
  const [, changeByAdmin] = useChangePasswordByAdminMutation();
  const [, changeByUser] = useChangePasswordByUserMutation();

  const submitPassword = async values => {
    const response = user
      ? await changeByAdmin({ id: user.id, ...values })
      : await changeByUser(values);

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `La contraseña no pudo ser modificada. ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Cambio de Contraseña',
        'La contraseña fue modificada correctamente.'
      );
    }
    if (user) {
      setUser(null);
    }
    setVisible(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={passwordSchema}
      onSubmit={values => submitPassword(values)}
      validateOnBlur
    >
      {({ errors, touched, isSubmitting }) => (
        <Form
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Input
            name="password"
            type="password"
            label="Contraseña"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            error={errors?.password}
            touched={touched?.password}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirmar contraseña"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            error={errors?.confirmPassword}
            touched={touched?.confirmPassword}
            required
          />
          <FormItem style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              icon={<CheckOutlined />}
            >
              Cambiar contraseña
            </Button>
          </FormItem>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordForm;
