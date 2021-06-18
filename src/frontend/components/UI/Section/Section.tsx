import React, { useEffect, useRef, HTMLAttributes } from 'react';

interface SectionProps {
  src?: string;
  size?: 'md' | 'lg';
  transparent?: boolean;
}

const Section: React.FC<SectionProps & HTMLAttributes<HTMLElement>> = ({
  src,
  size,
  transparent,
  children,
  ...props
}) => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const parallaxScroll = () => {
      if (window.innerWidth > 700) {
        const scroll_position = window.pageYOffset / 3;
        parallaxRef.current.style.backgroundPositionY = `calc(${
          size === 'md' ? 30 : 10
        }% + ${scroll_position}px)`;
      }
    };
    window.addEventListener('scroll', parallaxScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', parallaxScroll);
    };
  }, [src]);

  const haveSource = src => {
    if (
      typeof src !== 'undefined' &&
      src !== null &&
      !src!.includes('undefined')
    ) {
      return `url("${src}")`;
    }
    return null;
  };
  const bckImage = haveSource(src);

  return (
    <section
      ref={parallaxRef}
      {...props}
      style={{
        ...props.style,
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPositionX: '50%',
        backgroundColor: transparent ? 'transparent' : null,
        backgroundImage: bckImage,
      }}
    >
      {children}
    </section>
  );
};

export default React.memo(Section);
