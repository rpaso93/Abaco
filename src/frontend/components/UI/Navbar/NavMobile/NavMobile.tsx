import React from 'react';
import { LazyMotion, m, domAnimation, Variant } from 'framer-motion';
import NavItem from './NavItem';
import styles from './NavMobile.module.css';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';

const animate: Variant = {
  x: 0,
  opacity: 1,
  transition: {
    duration: .3,
    easings: 'easeInOut'
  },
};
const exit: Variant = {
  x: '100%',
  opacity: 0,
  transition: {
    duration: .3,
    easings: 'easeInOut'
  },
};

interface NavMobileProps {
  click: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavMobile: React.FC<NavMobileProps> = ({ click }) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.nav
        style={{
          position: 'fixed',
          top: 80,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(3px)',
          padding: '20px 0',
        }}
        initial={{ opacity: 0, x: '100%' }}
        animate={animate}
        exit={exit}
        onClick={() => click(false)}
      >
        <ul className={styles.MobileList} onClick={() => click(false)}>
          <NavItem href="/" label="home" />
          <NavItem href="/arquitectura" label="arquitectura" />
          <NavItem href="/desarrollo" label="desarrollo" />
          <NavItem href="/construccion" label="construccion" />
          <NavItem href="/quienes-somos" label="quiénes somos" />
        </ul>
        <div className={styles.NavSocial}>
          <a
            className={styles.SocialLink}
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener"
            onClick={() => click(false)}
          >
            <FacebookOutlined />
          </a>
          <a
            className={styles.SocialLink}
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener"
            onClick={() => click(false)}
          >
            <InstagramOutlined />
          </a>
        </div>
      </m.nav>
    </LazyMotion>
  );
};

export default NavMobile;
