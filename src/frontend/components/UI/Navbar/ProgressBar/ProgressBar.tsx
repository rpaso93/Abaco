import { useViewportScroll } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const ProgressBar: React.FC<{}> = ({}) => {
  const { scrollYProgress } = useViewportScroll();
  const [scrollTop, setScrollTop] = useState(0);

  const progressOnScroll = (progress = null) => {
    let scrolled = 0;
    if(progress === null){
      scrolled = scrollYProgress.get() * 100;
    }else{
      scrolled = progress * 100;
    }
    setScrollTop(scrolled);
  };

  useEffect(() => {
    progressOnScroll();
    setTimeout(progressOnScroll, 500);
    scrollYProgress.onChange(progress => progressOnScroll(progress));
    return () => {
      scrollYProgress.clearListeners();
    };
  }, [scrollYProgress]);

  const scale = `scaleX(${scrollTop}%)`;

  return (
    <span
      style={{
        backgroundColor: '#E6E6E6',
        position: 'absolute',
        width: `100%`,
        height: '6px',
        WebkitTransition: 'all 0.01s ease-in-out',
        msTransition: 'all 0.01s ease-in-out',
        transition: 'all 0.01s ease-in-out',
        WebkitTransformOrigin: 'left',
        msTransformOrigin: 'left',
        transformOrigin: 'left',
        bottom: 0,
        WebkitTransform : scale,
        msTransform: scale,
        transform: scale,
      }}
    />
  );
};

export default ProgressBar;
