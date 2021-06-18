import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import NavLink from './NavLink/NavLink';
import styles from './Navbar.module.css';
import Bars from './Bars/Bars';
import { AnimatePresence } from 'framer-motion';
import NavMobile from './NavMobile/NavMobile';
import ProgressBar from './ProgressBar/ProgressBar';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [showBars, setBars] = useState<boolean>(false);

  const onNavResize = () => {
    const width = window.innerWidth;
    switch (true) {
      case width <= 900:
        setBars(true);
        break;
      default:
        setBars(false);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', onNavResize, { passive: true });
    onNavResize();
    return () => {
      window.removeEventListener('resize', onNavResize);
    };
  }, []);

  return (
    <nav className={styles.Nav}>
      <div className={styles.NavUpper}>
        <NavLink
          href="/"
          label="Inicio"
          icon={<Logo style={{ minWidth: '220px' }} />}
        />
        {showBars && <Bars open={drawer} click={setDrawer} />}
        <div className={styles.NavMenu}>
          <NavLink href="/arquitectura" label="Arquitectura" />
          <NavLink href="/desarrollo" label="Desarrollo" />
          <NavLink href="/construccion" label="Construcción" />
          <NavLink href="/quienes-somos" label="Quiénes Somos" />
          <div className={styles.NavSocial}>
            <a
              className={styles.SocialLink}
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener"
            >
              <FacebookOutlined />
            </a>
            <a
              className={styles.SocialLink}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener"
            >
              <InstagramOutlined />
            </a>
          </div>
        </div>
      </div>
      <AnimatePresence exitBeforeEnter>
        {drawer && <NavMobile click={setDrawer} />}
      </AnimatePresence>
      <ProgressBar />
    </nav>
  );
};

export default Navbar;
