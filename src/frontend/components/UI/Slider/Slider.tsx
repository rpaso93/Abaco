import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AnimatePresence } from 'framer-motion';
import  Head  from 'next/head';
import React, { useState } from 'react';
import { Scalars } from '../../../generated/graphql';
import Slide from './Slide/Slide';
import styles from './Slider.module.css';

interface SliderProps {
  images: {
    __typename?: 'Image';
    id: Scalars['ID'];
    path: Scalars['String'];
    fileName: Scalars['String'];
  }[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [index, setIndex] = useState<number>(0);
  const [hover, setHover] = useState(null);
  const leftClickHandler = e => {
    e.preventDefault();
    setIndex(prevValue => prevValue - 1);
  };

  const onHover = num => {
    setHover(num);
  };

  const rightClickHandler = e => {
    e.preventDefault();
    setIndex(prevValue => prevValue + 1);
  };

  return (
    <div className={styles.Container}>
      {hover !== null && (
        <Head>
          <link
            rel="preload"
            href={`${images[index+hover]?.path}/${images[index+hover]?.fileName}-w600.webp`}
            as="image"
          />
        </Head>
      )}
      {index > 0 && (
        <button
          className={styles.LeftBtn}
          onClick={leftClickHandler}
          onMouseOver={() => onHover(-1)}
          onMouseLeave={() => setHover(null)}
        >
          <LeftOutlined className={styles.Arrow} />
        </button>
      )}
      <AnimatePresence initial={false} exitBeforeEnter>
        <Slide key={images[index]?.id} image={images[index]} />
      </AnimatePresence>
      {index < images.length - 1 && (
        <button
          className={styles.RightBtn}
          onClick={rightClickHandler}
          onMouseOver={() => onHover(1)}
          onMouseLeave={() => setHover(null)}
        >
          <RightOutlined className={styles.Arrow} />
        </button>
      )}
    </div>
  );
};

export default Slider;
