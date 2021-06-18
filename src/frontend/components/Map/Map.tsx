import { EnvironmentOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './Map.module.css';

const Map: React.FC<{}> = ({}) => {
  return (
    <section className={styles.Container}>
      <h2><EnvironmentOutlined /> Visitanos</h2>
      <iframe
        title="Location"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCs_Gs4WVwRr3t18YZN8Yhb67kkudx-ris&q=Dr.+Tadeo+Acuña+171,+San+Fernando+del+Valle+de+Catamarca,+Catamarca"
      ></iframe>
    </section>
  );
};

export default Map;
