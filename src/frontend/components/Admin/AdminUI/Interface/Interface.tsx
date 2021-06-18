import React from 'react';
import { UiStates } from '../types';
import styles from './Interface.module.css';
import dynamic from 'next/dynamic';

const DynamicUser = dynamic(() => import('./Users/Users'), { ssr: false});
const DynamicProjects = dynamic(() => import('./Projects/Projects'), { ssr: false});
const DynamicImages = dynamic(() => import('./Images/Images'), { ssr: false});
const DynamicPage = dynamic(() => import('./Page/Page'), { ssr: false});
const DynamicContact = dynamic(() => import('./ContactData/ContactData'), { ssr: false});

interface InterfaceProps {
  component: UiStates;
}

const Interface: React.FC<InterfaceProps> = ({ component }) => {
  let selectedComponent;
  switch (component) {
    case 'user':
      selectedComponent = <DynamicUser />;
      break;
    case 'project':
      selectedComponent = <DynamicProjects />;
      break;
    case 'images':
      selectedComponent = <DynamicImages />;
      break;
    case 'page':
      selectedComponent = <DynamicPage />;
      break;
    case 'contact':
      selectedComponent = <DynamicContact />;
      break;
    default:
      selectedComponent = <DynamicUser />;
      break;
  }

  return <div className={styles.Interface}>{selectedComponent}</div>;
};

export default Interface;
