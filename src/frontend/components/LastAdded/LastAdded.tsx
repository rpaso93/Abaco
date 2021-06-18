import React from 'react';
import ImgSlider from './ImgSlider/ImgSlider';
import styles from './LastAdded.module.css';

interface LastAddedProps {}

const LastAdded: React.FC<LastAddedProps> = ({}) => {
  return (
    <section className={styles.Container}>
      <h3 className={styles.Title}>Últimos Proyectos</h3>
      <ImgSlider />
    </section>
  );
};

export default LastAdded;
