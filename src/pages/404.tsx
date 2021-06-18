import { domAnimation, m, LazyMotion } from 'framer-motion';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../pagesCss/404.module.css';

const _404: NextPage<{}> = ({}) => {
  return (
    <>
      <Head>
        <title>404 - Ábaco</title>
      </Head>
      <LazyMotion features={domAnimation}>
        <m.main
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.2, easings: 'easeInOut' }}
          className={styles.Body}
        >
          <div>
            <h1>404</h1>
            <h3>Lo sentimos,</h3>
            <h3>no se encuentra la página que está buscando</h3>
          </div>
        </m.main>
      </LazyMotion>
    </>
  );
};

export default _404;
