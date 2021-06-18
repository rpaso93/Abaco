import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './NavLink.module.css';

interface NavLinkProps {
  href?: string;
  label?: string;
  mobile?: boolean;
  icon?: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ label, href, icon, mobile }) => {
  const classNames = mobile ? [styles.MobileLink] : [styles.Link];
  const router = useRouter();

  if (router.pathname === href) {
    classNames.push(styles.active);
  }

  return (
    <Link href={href} passHref>
      <a id={`link_${label}`} title={label}
        className={classNames.join().replace(',', ' ')}
        style={typeof icon === 'undefined' ? {} : { flex: 0.5, maxWidth: '300px', display: 'flex' }}
      >
        {typeof icon === 'undefined' ? label.toUpperCase() : icon}
      </a>
    </Link>
  );
};

export default NavLink;
