import {
  LockFilled,
  UserSwitchOutlined,
  DeleteFilled,
  EditFilled,
} from '@ant-design/icons';
import { Space, Tooltip, Button, Popconfirm, Table, Modal } from 'antd';
import React, { useState } from 'react';
import {
  useChangeRoleMutation,
  useDeleteUserMutation,
  useDeleteUsersMutation,
  useGetUserQuery,
  useGetUsersQuery,
  User,
} from '../../../../../generated/graphql';
import Actions from '../../../../UI/Actions/Actions';
import { openNotificationWithIcon } from '../../../../UI/Notifacion/Notifcation';
import { filterData } from '../filterData';
import styles from '../Interface.module.css';
import { Local } from '../tableLocal';
import PasswordForm from './PasswordForm/PasswordForm';
import UserAddOrEdit from './UserAddOrEdit/UserAddOrEdit';

const { Column } = Table;

const Users: React.FC<{}> = ({}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const [selectedUser, setUserToEdit] = useState<User>(null);
  const [isChangingPassword, setChangingPassword] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState('');
  const [{ data: userData }] = useGetUserQuery();
  const [{ data, fetching }] = useGetUsersQuery({
    requestPolicy: 'cache-and-network',
  });
  const [
    { fetching: roleFetching, operation: roleData },
    changeRole,
  ] = useChangeRoleMutation();
  const [, deleteUser] = useDeleteUserMutation();
  const [, deleteUsers] = useDeleteUsersMutation();

  const editHandler = (user: User) => {
    setUserToEdit(user);
    setVisibility(true);
  };

  const passwordHandler = (user: User) => {
    setUserToEdit(user);
    setChangingPassword(true);
    setVisibility(true);
  };

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const deleteHandler = async id => {
    const response = await deleteUser({ id });
    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `${response.error.message}`
      );
    }
    if (response.data.deleteUser) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'El usuario fue borrado correctamente'
      );
    }
  };

  const MultipleDeleteHandler = async () => {
    const response = await deleteUsers({ ids: selectedRowKeys });
    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `${response.error.message}.`
      );
      return;
    }
    if (response.data.deleteUsers) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'Los usuarios fueron borrados correctamente'
      );
    }
  };

  return (
    <div className={styles.Container}>
      <Actions
        filter={setFilter}
        action={setVisibility}
        delete={MultipleDeleteHandler}
        selectedRows={selectedRowKeys}
        type="user"
      />
      <Table
        style={{ height: '85%' }}
        dataSource={
          filter.length === 0
            ? data?.getUsers
            : filterData(filter, data?.getUsers)
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        pagination={{
          pageSize: 9,
          hideOnSinglePage: true,
          position: ['bottomCenter'],
        }}
        rowKey={record => record.id}
        loading={fetching}
        scroll={{ x: true }}
        locale={Local}
      >
        <Column
          title="Nombre"
          dataIndex="name"
          key="name"
          onFilter={(value, record: User) =>
            record.name.indexOf(value as any) === 0
          }
          sorter={(a, b) => a.name.length - b.name.length}
          sortDirections={['descend', 'ascend']}
        />
        <Column
          title="Apellido"
          dataIndex="lastname"
          key="lastname"
          onFilter={(value, record: User) =>
            record.lastname.indexOf(value as any) === 0
          }
          sorter={(a, b) => a.lastname.length - b.lastname.length}
          sortDirections={['descend', 'ascend']}
        />
        <Column
          title="Correo"
          dataIndex="email"
          key="email"
          onFilter={(value, record: User) =>
            record.email.indexOf(value as any) === 0
          }
          sorter={(a, b) => a.email.length - b.email.length}
          sortDirections={['descend', 'ascend']}
        />
        <Column
          title="Rol de Usuario"
          dataIndex="role"
          key="role"
          onFilter={(value, record: User) =>
            record.role.description.indexOf(value as any) === 0
          }
          sorter={(a: User, b: User) =>
            a.role.description.length - b.role.description.length
          }
          sortDirections={['descend', 'ascend']}
          render={(value, record) => {
            return record.role.description === 'sub_admin'
              ? 'Sub Administrador'
              : 'Sólo Proyectos';
          }}
        />
        <Column
          title="Acción"
          key="action"
          fixed="right"
          render={(record: User) => (
            <Space size="middle">
              <Tooltip title="Cambiar contraseña">
                <Button
                  icon={<LockFilled />}
                  key={`btnPass${record.id}`}
                  type="dashed"
                  shape="circle"
                  onClick={() => passwordHandler(record)}
                />
              </Tooltip>
              {userData.getUser.role.description === 'admin' && (
                <Tooltip title="Cambiar rol">
                  <Button
                    icon={<UserSwitchOutlined />}
                    key={`btnRole${record.id}`}
                    type="dashed"
                    shape="circle"
                    loading={
                      roleFetching && roleData?.variables.id === record.id
                    }
                    onClick={() => changeRole({ id: record.id })}
                  />
                </Tooltip>
              )}
              <Tooltip title="Editar Usuario">
                <Button
                  icon={<EditFilled />}
                  key={`btnPass${record.id}`}
                  type="dashed"
                  shape="circle"
                  onClick={() => editHandler(record)}
                />
              </Tooltip>
              <Popconfirm
                title="Estas seguro de borrarlo?"
                onConfirm={() => deleteHandler(record.id)}
                okText="Si"
                cancelText="No"
              >
                <Button
                  icon={<DeleteFilled />}
                  type="dashed"
                  shape="circle"
                  key={`btnDelete${record.id}`}
                />
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      <Modal
        title={
          selectedUser
            ? isChangingPassword
              ? `Cambiar contraseña de: ${selectedUser.name}`
              : `Edición de: ${selectedUser.name}`
            : 'Nuevo Usuario'
        }
        visible={isVisible}
        footer={false}
        onCancel={() => {
          setUserToEdit(null);
          setChangingPassword(null);
          setVisibility(false);
        }}
        destroyOnClose
        width={'42%'}
        maskClosable={false}
      >
        {isChangingPassword ? (
          <PasswordForm
            user={selectedUser}
            setUser={setUserToEdit}
            setVisible={setVisibility}
          />
        ) : (
          <UserAddOrEdit
            user={selectedUser}
            setUser={setUserToEdit}
            setVisible={setVisibility}
            isAdmin
          />
        )}
      </Modal>
    </div>
  );
};

export default React.memo(Users);
