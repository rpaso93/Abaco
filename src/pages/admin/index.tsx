import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Login from '../../frontend/components/Admin/Login/Login';
import { useLogoutMutation } from '../../frontend/generated/graphql';
import { urqlClientAdmin } from '../../utils/urqlClientAdmin';
import {
  deleteExpDate,
  deleteToken,
  getExpDate,
  getToken,
} from '../../utils/local';
import 'antd/dist/antd.css';

const DynamicAdminUI = dynamic(
  () => import('../../frontend/components/Admin/AdminUI/AdminUI'), { ssr: false}
);

const Admin: NextPage<{}> = ({}) => {
  const [isAuth, setAuth] = useState(false);
  const [, logout] = useLogoutMutation();

  const logoutHandler = async () => {
    await logout();
    deleteToken();
    deleteExpDate();
    setAuth(false);
  };

  const setAutoLogout = (milliseconds: number) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  useEffect(() => {
    const token = getToken();
    const expiryDate = getExpDate();
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setAutoLogout(remainingMilliseconds);
    setAuth(true);
  }, []);

  const component = !isAuth ? <Login login={setAuth} autoLogout={setAutoLogout} /> : <DynamicAdminUI logout={logoutHandler} />;

  return (
    <>
      {component}
    </>
  );
};

export default withUrqlClient(urqlClientAdmin, { ssr: true })(Admin);
