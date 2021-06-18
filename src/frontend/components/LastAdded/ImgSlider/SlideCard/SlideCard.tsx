import { Variants, m, domAnimation, LazyMotion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { formatDate } from '../../../../../utils/date';
import { getSrcPath } from '../../../../../utils/getSrcPath';
import { Category } from '../../../../generated/graphql';
import styles from './SlideCard.module.css';

interface SlideCardProps {
  variants: Variants;
  project;
  side?: 'left' | 'right';
}

const SlideCard: React.FC<SlideCardProps> = ({ variants, project, side }) => { 
  const router = useRouter();
  const cardStyle = [styles.Card];
  const imgSize = useRef<number>(300);

  if (typeof side !== 'undefined') {
    cardStyle.push(side === 'left' ? styles.Left : styles.Right);
  }

  useEffect(() => {
    const width = window.innerWidth;
    switch (true) {
      case width <= 400:
        imgSize.current = 300;
        break;
      case width > 400:
        imgSize.current = 600;
        break;
    }
  }, []);

  const path = getSrcPath(project, imgSize.current);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        style={{
          backgroundImage: `url("${path}")`,
        }}
        initial="hidden"
        animate="animate"
        variants={variants}
        className={cardStyle.join(' ')}
        onClick={() =>
          router.push(`/${categoriesToRoute(project.categories)}/${project.id}` 
          )
        }
      >
        <span className={styles.Date}>
          {formatDate(project.year)}
        </span>
      </m.div>
    </LazyMotion>
  );
};

export default SlideCard;

const categoriesToRoute = (categories: Category[]): string => {
  if (
    categories.some(
      cat => cat.name === 'Construcción' || cat.name === 'Arquitectura'
    )
  ) {
    return categories[0].name === 'Construcción'
      ? 'construccion'
      : 'arquitectura';
  }
  return 'desarrollo';
};

const categoriesToSpan = (categories: Category[]): string => {
  if (
    categories.some(
      cat => cat.name === 'Construcción' || cat.name === 'Arquitectura'
    )
  ) {
    return categories[0].name === 'Construcción'
      ? 'Construcción'
      : 'Arquitectura';
  }
  return 'Desarrollo';
};
