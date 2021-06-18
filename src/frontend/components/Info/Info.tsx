import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import React from 'react';
import { useGetContactDataQuery } from '../../generated/graphql';
import styles from './Info.module.css';

const Info: React.FC<{}> = ({}) => {
  const [{ fetching, data }] = useGetContactDataQuery();

  return (
    <div className={styles.Container}>
      {data?.getData?.map(_data => (
        <div key={_data.id} className={styles.Data}>
          <h4 className={styles.Title}>
            {setIcon(_data.id)}
            {_data.id}
          </h4>
          <hr />
          <p className={styles.Content}>{_data.value}</p>
        </div>
      ))}
    </div>
  );
};

const setIcon = (id: string) => {
  switch (id) {
    case 'teléfono':
      return <PhoneOutlined style={{ fontSize: 32 }} />;
    case 'email':
      return <MailOutlined style={{ fontSize: 32 }} />;
    case 'dirección':
      return <EnvironmentOutlined style={{ fontSize: 32 }} />;
  }
};

export default Info;
