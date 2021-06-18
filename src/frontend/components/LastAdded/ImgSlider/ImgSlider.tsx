import React, { useState } from 'react';
import styles from './ImgSlider.module.css';
import { AnimatePresence, Variants } from 'framer-motion';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  useGetLatestProjectsQuery,
} from '../../../generated/graphql';
import SlideCard from './SlideCard/SlideCard';

interface ImgSliderProps {}

const leftVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { stiffness: 100 },
  },
  animate: {
    opacity: 1,
  },
};

const middleVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { stiffness: 100 },
  },
  animate: {
    opacity: 1,
    transition: { stiffness: 100 },
  },
};

const rightVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { stiffness: 100 },
  },
  animate: {
    opacity: 1,
    transition: { stiffness: 100 },
  },
};

const ImgSlider: React.FC<ImgSliderProps> = ({}) => {
  const [{ data }] = useGetLatestProjectsQuery();
  const [index, setIndex] = useState<number>(0);

  const leftClickHandler = () => {
    setIndex(prevValue => prevValue - 1);
  };

  const rightClickHandler = () => {
    setIndex(prevValue => prevValue + 1);
  };

  return (
    <div className={styles.Container}>
      {index > 0 && (
        <button className={styles.LeftBtn} onClick={leftClickHandler}>
          <LeftOutlined className={styles.Arrow} />
        </button>
      )}
      <AnimatePresence initial={false}>
        {data?.latestProjects.map((project, _index) => {
          if (_index === index) {
            return (
              <SlideCard
                key={project.id}
                variants={leftVariants}
                project={project}
                side='left'
              />
            );
          }
          if (_index === index + 1) {
            return (
              <SlideCard
                key={project.id}
                variants={middleVariants}
                project={project}
              />
            );
          }
          if (_index === index + 2) {
            return (
              <SlideCard
                key={project.id}
                variants={rightVariants}
                project={project}
                side='right'
              />
            );
          }
          return null;
        })}
      </AnimatePresence>
      {index + 3 < data?.latestProjects?.length && (
        <button className={styles.RightBtn} onClick={rightClickHandler}>
          <RightOutlined className={styles.Arrow} />
        </button>
      )}
    </div>
  );
};

export default ImgSlider;
