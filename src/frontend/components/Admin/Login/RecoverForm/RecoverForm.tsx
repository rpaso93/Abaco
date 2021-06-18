import React, { Dispatch, SetStateAction, useState } from 'react';
import { Form, Formik } from 'formik';
import { Button, Form as AntdForm, Divider, Typography } from 'antd';
import styles from '../LoginForm/LoginForm.module.css';
import Input from '../../../UI/FormFields/Input';
import { useForgotPasswordMutation } from '../../../../generated/graphql';
import { forgotPasswordSchema } from '../../../../../utils/validations';

const FormItem = AntdForm.Item;
const { Title, Paragraph } = Typography;

interface RecoverFormProps {
  forgotPass: Dispatch<SetStateAction<boolean>>;
}

const RecoverForm: React.FC<RecoverFormProps> = ({ forgotPass }) => {
  const [isComplete, setComplete] = useState(false);
  const [content, setContent] = useState(
    'Revisa tu cuenta de correo, te hemos enviado un email para que puedas recuperar tu cuenta'
  );
  const [, sendEmail] = useForgotPasswordMutation();

  const changeToLogin = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    forgotPass(true);
  };

  const component = !isComplete ? (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async values => {
        const result = await sendEmail(values);
        if (result.error) {
          setContent('No existe un usuario con ese email');
        }
        setComplete(true);
      }}
      validationSchema={forgotPasswordSchema}
      validateOnBlur
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.Form}>
          <Title level={5}>Recuperar Contraseña</Title>
          <Divider className={styles.Divider} />
          <Input
            name="email"
            email
            label="Ingresa tu email"
            type="input"
            className={styles.InputWidth}
            error={errors?.email}
            touched={touched?.email}
            justPlaceholder
            required
          />
          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Confirmar
            </Button>
          </FormItem>
          <span>
            <a href="" onClick={e => changeToLogin(e)}>
              Volver atras
            </a>
          </span>
        </Form>
      )}
    </Formik>
  ) : (
    <div className={styles.Form}>
      <Paragraph>{content}</Paragraph>
      <span>
        <a
          href=""
          onClick={e => {
            e.preventDefault();
            setComplete(false);
          }}
        >
          Volver atras
        </a>
      </span>
    </div>
  );

  return component;
};

export default RecoverForm;
