import React from 'react';
import NavLink from '../NavLink/NavLink';
import styles from './NavMobile.module.css';

interface NavItemProps {
  href: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({label, href}) => {
  return (
      <li className={styles.MobileItem}>
        <NavLink label={label} href={href} mobile/>
      </li>
  );
};

export default NavItem;