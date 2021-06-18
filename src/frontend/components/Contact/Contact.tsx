import React from 'react';
import styles from './Contact.module.css';
import Form from './Form/Form';

interface ContactProps {}

const Contact: React.FC<ContactProps> = ({}) => {
  return (
    <section className={styles.Container}>
      <h2 className={styles.Title}>Contactanos</h2>
      <Form />
    </section>
  );
};

export default Contact;
