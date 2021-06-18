import { LazyMotion, domAnimation, m, Variants } from 'framer-motion';
import React from 'react';
import { Scalars } from '../../../../generated/graphql';

interface SlideProps {
  image: {
    __typename?: 'Image';
    id: Scalars['ID'];
    path: Scalars['String'];
    fileName: Scalars['String'];
  };
}

const variants: Variants = {
  hidden: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const Slide: React.FC<SlideProps> = ({ image }) => {
  const src = `${image?.path}/${image?.fileName}-w600.webp`;
  return (
    <LazyMotion features={domAnimation}>
      <m.img src={src} initial="hidden" animate="animate" variants={variants} key={image?.id}/>
    </LazyMotion>
  );
};

export default Slide;
