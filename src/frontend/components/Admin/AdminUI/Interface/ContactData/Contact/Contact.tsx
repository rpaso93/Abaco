import {
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import {
  ContactData,
  useUpdateContactDataMutation,
} from '../../../../../../generated/graphql';
import Input from '../../../../../UI/FormFields/Input';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';
import styles from './Contact.module.css';

const { Text } = Typography;

interface ContactProps {
  contact: {
    __typename?: 'ContactData';
  } & Pick<ContactData, 'value' | 'id'>;
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [isEditing, setEditing] = useState(false);
  const [, update] = useUpdateContactDataMutation();
  const icon = setIcon(contact.id);

  const submitContact = async value => {
    const result = await update({ id: contact.id, value: value.value });
    if (result.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `ERROR: ${result.error.message}.`
      );
      return;
    }
    if (result.data) {
      setEditing(false);
      openNotificationWithIcon('success', 'Edición Completa', '');
    }
  };

  return (
    <div className={styles.Container}>
      {icon}
      <div className={styles.Text}>
        {!isEditing ? (
          <>
            <Text style={{ textTransform: 'capitalize', fontSize: 15, fontWeight: 600 }}>
              {contact.id}:{'  '}
              <Text type='secondary' style={{ textTransform: 'none', fontSize: 15 }}>
                {contact.value}
              </Text>
            </Text>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            ></Button>
          </>
        ) : (
          <Formik
            initialValues={{ value: contact.value }}
            onSubmit={value => submitContact(value)}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form  className={styles.Form}>
                <Input
                  className={styles.Input}
                  name="value"
                  type="input"
                  error={errors.value}
                  touched={touched.value}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="circle"
                  icon={<CheckOutlined />}
                ></Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setEditing(false)}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  shape="circle"
                  icon={<CloseOutlined />}
                ></Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const setIcon = (id: string) => {
  switch (id) {
    case 'teléfono':
      return <PhoneOutlined style={{ fontSize: 25, marginRight: 5 }} />;
    case 'email':
      return <MailOutlined style={{ fontSize: 25, marginRight: 5 }} />;
    case 'dirección':
      return <EnvironmentOutlined style={{ fontSize: 25, marginRight: 5 }} />;
  }
};

export default Contact;
