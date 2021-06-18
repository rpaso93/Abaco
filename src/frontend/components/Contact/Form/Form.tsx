import React from 'react';
import { Form as FormikForm, Formik } from 'formik';
import Input from './Input/Input';
import styles from './Form.module.css';
import { useSendContactEmailMutation } from '../../../generated/graphql';
import { contactSchema } from '../../../../utils/validations';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: '#E6E6E6' }} spin />
);
const spinner = <Spin indicator={loadingIcon} />;

const Form: React.FC<{}> = ({}) => {
  const [, sendEmail] = useSendContactEmailMutation();

  const passError = (error: string, touch: boolean) => {
    return error && touch ? error : null;
  }

  return (
    <Formik
      initialValues={{
        input: {
          name: '',
          email: '',
          issue: '',
          content: '',
        },
      }}
      onSubmit={async values => {
        const response = await sendEmail(values);
      }}
      validationSchema={contactSchema}
      validateOnBlur
    >
      {({ errors, touched, isSubmitting }) => (
        <FormikForm className={styles.Container}>
          <div className={styles.Form}>
            <div className={styles.ContactInfo}>
              <Input
                name="input.name"
                label="Nombre"
                err={passError(errors?.input?.name, touched?.input?.name)}
              />
              <Input
                name="input.email"
                label="Correo electrónico"
                err={passError(errors?.input?.email, touched?.input?.email)}
              />
              <Input
                name="input.issue"
                label="Razón"
                err={passError(errors?.input?.issue, touched?.input?.issue)}
              />
            </div>
            <Input
              name="input.content"
              label="Consulta"
              textBox
              flex
              err={passError(errors?.input?.content, touched?.input?.content)}
            />
          </div>
          <button className={styles.Button} type="submit">
            {!isSubmitting ? 'Enviar' : spinner}
          </button>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
