import { List, Typography } from 'antd';
import React from 'react';
import { useGetContactDataQuery } from '../../../../../generated/graphql';
import Contact from './Contact/Contact';
import intStyles from '../Interface.module.css';

const { Title } = Typography;

interface ContactDataProps {}

const ContactData: React.FC<ContactDataProps> = ({}) => {
  const [{ fetching, data }] = useGetContactDataQuery();

  return (
    <div className={intStyles.Container}>
      <List
        header={<Title level={3}>Información de Contacto</Title>}
        dataSource={data?.getData.reverse()}
        style={{ alignSelf: 'center', width: '100%' }}
        loading={fetching}
        renderItem={value => <Contact contact={value} />}
      />
    </div>
  );
};

export default ContactData;
