import { useRouter } from 'next/router';
import React from 'react';
import styles from './BtnLink.module.css';

interface BtnLinkProps {
  name: string;
  path: string;
}

const BtnLink: React.FC<BtnLinkProps> = ({ name, path }) => {
  const router = useRouter();

  const clickHandler = () => {
    router.push(path, path);
  };

  return (
    <button className={styles.Btn} onClick={clickHandler}>
      {name.toLocaleUpperCase()}
    </button>
  );
};

export default BtnLink;
