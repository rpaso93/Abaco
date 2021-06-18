import { NextPage } from 'next';
import Head from 'next/head';
import Logo from '../../../frontend/components/UI/Logo/Logo';
import styles from '../../../frontend/components/Admin/Login/Login.module.css';
import ChangePasswordForm from '../../../frontend/components/Admin/ChangePasswordForm/ChangePasswordForm';
import { withUrqlClient } from 'next-urql';
import { urqlClientAdmin } from '../../../utils/urqlClientAdmin';
import 'antd/dist/antd.css'

const ChangePassword: NextPage<{}> = ({}) => {
  return (
    <>
      <Head>
        <title>Cambiar Contraseña - Ábaco</title>
      </Head>
      <div className={styles.Container}>
        <Logo isBlack />
        <ChangePasswordForm />
      </div>
    </>
  );
};

export default withUrqlClient(urqlClientAdmin, { ssr: true })(ChangePassword);
