import React, { useEffect, useState } from 'react';
import Interface from './Interface/Interface';
import UserInfo from './UserInfo/UserInfo';
import { UiStates } from './types';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ProjectOutlined,
  PictureOutlined,
  DotChartOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import Logo from '../../UI/Logo/Logo';
import { useGetUserQuery } from '../../../generated/graphql';
import Head from 'next/head';

const { Header, Sider, Content } = Layout;

interface AdminUIProps {
  logout: () => void;
}

const AdminUI: React.FC<AdminUIProps> = ({ logout }) => {
  const [active, setActive] = useState<UiStates>('project');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [{ data }] = useGetUserQuery();

  const onResize = () => {
    const width = window.innerWidth;
    switch (true) {
      case width <= 1250:
        setCollapsed(true);
        break;
      default:
        setCollapsed(false);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', onResize, { passive: true });
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggle = () => {
    setCollapsed(prevValue => !prevValue);
  };
  const isAdmin =
    data?.getUser?.role.description === 'admin' ||
    data?.getUser?.role.description === 'sub_admin';

  return (
    <>
      <Head>
        <title>Administración - Ábaco</title>
      </Head>
      <Layout style={{overflow: 'hidden', maxHeight: '100vh'}}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ height: '100vh', backgroundColor: 'rgb(21,21,21)' }}
        >
          <Logo
            style={{ height: '60px', margin: '25px 0' }}
            onlyLogo={collapsed}
          />
          <Menu
            theme="dark"
            style={{ backgroundColor: 'rgb(21,21,21)' }}
            mode="inline"
          >
            {isAdmin && (
              <Menu.Item
                key="1"
                icon={<UserOutlined style={{ fontSize: 18 }} />}
                onClick={() => setActive('user')}
              >
                Usuarios
              </Menu.Item>
            )}
            <Menu.Item
              key="2"
              icon={<ProjectOutlined style={{ fontSize: 18 }} />}
              onClick={() => setActive('project')}
            >
              Proyectos
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<PictureOutlined style={{ fontSize: 18 }} />}
              onClick={() => setActive('images')}
            >
              Imagenes
            </Menu.Item>
            {isAdmin && (
              <>
                <Menu.Item
                  key="4"
                  icon={<DotChartOutlined style={{ fontSize: 18 }} />}
                  onClick={() => setActive('page')}
                >
                  Paginas
                </Menu.Item>
                <Menu.Item
                  key="5"
                  icon={<ContactsOutlined style={{ fontSize: 18 }} />}
                  onClick={() => setActive('contact')}
                >
                  Info. Contacto
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>
        <Layout style={{ backgroundColor: '#e6e6e6', overflowY: 'hidden' }}>
          <Header
            style={{
              padding: '0 30px',
              backgroundColor: 'rgb(32,32,32)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: toggle,
                style: {
                  fontSize: 20,
                  color: '#E6E6E6',
                },
              }
            )}
            <UserInfo logout={logout} />
          </Header>
          <Content
            style={{
              margin: '16px auto',
              padding: 12,
              minHeight: 280,
              maxHeight: '100%',
            }}
          >
            <Interface component={active} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminUI;
