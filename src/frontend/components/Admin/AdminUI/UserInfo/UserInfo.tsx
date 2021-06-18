import { EditOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Space, Typography } from 'antd';
import React, {useState} from 'react';
import { useGetUserQuery } from '../../../../generated/graphql';
import PasswordForm from '../Interface/Users/PasswordForm/PasswordForm';
import UserAddOrEdit from '../Interface/Users/UserAddOrEdit/UserAddOrEdit';

interface UserInfoProps {
  logout: () => void;
}

const { Text } = Typography;

const UserInfo: React.FC<UserInfoProps> = ({ logout }) => {
  const [{ data }] = useGetUserQuery();
  const [isVisible, setVisibility] = useState<boolean>(false);
  const [isChangingPassword, setChangingPassword] = useState<boolean>(false);

  const handleEdit = () => {
    setVisibility(true);
  }

  const changePassword = () => {
    setChangingPassword(true);
    setVisibility(true);
  }

  const menu = (
    <Menu >
      <Menu.Item key="0" onClick={handleEdit} icon={<EditOutlined style={{fontSize: 15}}/>}>
        <Text>Editar mis datos</Text>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={changePassword} icon={<LockOutlined style={{fontSize: 15}}/>}>
        <Text>Cambiar mi contraseña</Text>
      </Menu.Item>
    </Menu>
  );

  if (!data) {
    return <h3>Loading</h3>;
  }

  if (data) {
    return (
      <Space align="center" size="large">
        <Text strong style={{color: '#E6E6E6'}}>
          Hola, {data.getUser?.name} {data.getUser?.lastname}
        </Text>
        <Dropdown overlay={menu} trigger={['click']} placement='bottomRight' arrow >
          <Button type='ghost' icon={<UserOutlined style={{color: 'white'}}/>} />
        </Dropdown>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          danger
          onClick={() => logout()}
        >
          Salir
        </Button>
        <Modal
          title={
              isChangingPassword
                ? `Cambiar mi contraseña`
                : `Editar mi Usuario`
          }
          visible={isVisible}
          footer={false}
          onCancel={() => {
            setChangingPassword(null);
            setVisibility(false);
          }}
          destroyOnClose
          width={'42%'}
        >
          {isChangingPassword ? (
            <PasswordForm
              setVisible={setVisibility}
            />
          ) : (
            <UserAddOrEdit
              user={data.getUser}
              setVisible={setVisibility}
            />
          )}
        </Modal>
      </Space>
    );
  }
};

export default UserInfo;
