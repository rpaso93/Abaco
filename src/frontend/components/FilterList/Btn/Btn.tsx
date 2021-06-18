import React, { HtmlHTMLAttributes } from 'react';
import styles from './Btn.module.css';

interface BtnProps {
  active?: boolean;
}

const Btn: React.FC<BtnProps & HtmlHTMLAttributes<HTMLButtonElement>> = ({
  active,
  children,
  ...props
}) => {
  const btnStyles = [styles.Btn];

  if(active){
    btnStyles.push(styles.Active);
  }

  return <button {...props} className={btnStyles.join(' ')}>{children}</button>;
};

export default Btn;
