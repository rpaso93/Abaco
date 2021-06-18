import React, { useState, Dispatch, SetStateAction } from 'react';
import styles from './Login.module.css';
import Logo from '../../UI/Logo/Logo';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'antd/dist/antd.css';

const DynamicLoginForm = dynamic(() => import('./LoginForm/LoginForm'));
const DynamicRecoverForm = dynamic(() => import('./RecoverForm/RecoverForm'));

interface LoginProps {
  login: Dispatch<SetStateAction<boolean>>;
  autoLogout: (milliseconds: any) => void;
}

const Login: React.FC<LoginProps> = ({ login, autoLogout }) => {
  const [isLoginIn, setLoginIn] = useState<boolean>(true);

  const component = isLoginIn ? (
    <DynamicLoginForm
      login={login}
      autoLogout={autoLogout}
      forgotPass={setLoginIn}
    />
  ) : (
    <DynamicRecoverForm forgotPass={setLoginIn} />
  );

  const actTitle = isLoginIn ? 'Iniciar Sesión' : 'Recuperar Contraseña'

  return (
    <>
      <Head>
        <title>{actTitle} - Ábaco</title>
      </Head>
      <div className={styles.Container}>
        <Logo isBlack />
        {component}
      </div>
    </>
  );
};

export default Login;
