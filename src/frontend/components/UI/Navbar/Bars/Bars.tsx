import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './Bars.module.css';

interface BarsProps {
  open: boolean;
  click: React.Dispatch<React.SetStateAction<boolean>>;
}

const Bars: React.FC<BarsProps> = ({ open, click }) => {
  if (open) {
    return <CloseOutlined className={styles.Bars} style={{color: '#E6E6E6'}} role='close' onClick={() => click(false)} />;
  }
  return <MenuOutlined className={styles.Bars} style={{color: '#E6E6E6'}} role='menu' onClick={() => click(true)} />;
};

export default Bars;
