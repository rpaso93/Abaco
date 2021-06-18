import React, { useLayoutEffect, useRef, useState } from 'react';
import { LazyMotion, m, domAnimation, Variants } from 'framer-motion';
import styles from './Card.module.css';
import { Project, Image } from '../../../generated/graphql';
import { formatDate } from '../../../../utils/date';
import Head from 'next/head';

interface CardProps {
  project: any;
  onClick?: (
    project: {
      __typename?: 'Project';
    } & Pick<Project, 'name' | 'id' | 'description'> & {
        images?: ({
          __typename?: 'Image';
        } & Pick<Image, 'path' | 'id'>)[];
      }
  ) => void;
  current?: boolean;
  close?: () => void;
}

const cardVariants: Variants = {
  initial: {
    opacity: 0,
    transition: {
      stiffness: 100,
      damping: 30,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      stiffness: 100,
      damping: 30,
    },
  },
};

const Card: React.FC<CardProps> = ({ project, onClick, current, close }) => {
  const [hover, setHover] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>();
  const clickHandler = project => {
    if (!onClick) {
      return;
    }
    onClick(project);
    close();
  };

  const img =
    typeof project?.portraitId !== 'undefined'
      ? project?.images.find(img => img.id === project.portraitId)
      : project?.images[0];
  const src = `${img?.path}/${img?.fileName}-w300.webp`;

  return (
    <LazyMotion features={domAnimation}>
      <Head>
        {hover && (
          <link
            rel="preload"
            href={`${img?.path}/${img?.fileName}.webp`}
            as="image"
          />
        )}
      </Head>
      <m.div
        initial="initial"
        animate="animate"
        exit="initial"
        variants={cardVariants}
        ref={divRef}
        style={{
          backgroundImage: `url("${src}")`,
          border: current ? '1px solid #E6E6E6' : '',
        }}
        className={styles.Card}
        onClick={() => clickHandler(project)}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={styles.Body}>
          <div className={styles.Header}>
            <h3>{project.name}</h3>
          </div>
          <div className={styles.Data}>
            <h4>{project.location}</h4>
            <span>{formatDate(project.year)}</span>
          </div>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default Card;
