import React, { useState } from 'react';
import {
  Project,
  useDeleteProjectMutation,
  useDeleteProjectsMutation,
  useGetProjectsQuery,
} from '../../../../../generated/graphql';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import styles from '../Interface.module.css';
import { openNotificationWithIcon } from '../../../../UI/Notifacion/Notifcation';
import Actions from '../../../../UI/Actions/Actions';
import { Local } from '../tableLocal';
import { filterData } from '../filterData';
import dynamic from 'next/dynamic';

const DynamicProjectAddOrEdit = dynamic(() => import('./ProjectAddOrEdit/ProjectAddOrEdit'));

const { Column } = Table;

const Projects: React.FC<{}> = ({}) => {
  const [isVisible, setVisibility] = useState<boolean>(false);
  const [selectedProject, setProjectToEdit] = useState<Project>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState('');
  const [{ data, fetching }] = useGetProjectsQuery();
  const [, deleteProject] = useDeleteProjectMutation();
  const [, deleteProjects] = useDeleteProjectsMutation();

  const editHandler = (project: Project) => {
    setProjectToEdit(project);
    setVisibility(true);
  };

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const deleteHandler = async id => {
    const response = await deleteProject({ id });
    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `${response.error.message}`
      );
    }
    if (response.data.deleteProject) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'El proyecto fue borrado correctamente'
      );
    }
  };

  const MultipleDeleteHandler = async () => {
    const response = await deleteProjects({ ids: selectedRowKeys });
    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `${response.error.message}.`
      );
    }
    if (response.data.deleteProjects) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'Los proyectos fueron borrados correctamente'
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
        type="project"
      />
      <Table
        style={{ height: '85%' }}
        dataSource={
          filter.length === 0
            ? data?.projects
            : filterData(filter, data?.projects)
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        pagination={{
          pageSize: 8,
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
          sorter={(a: Project, b: Project) => a.name.length - b.name.length}
          sortDirections={['descend', 'ascend']}
        />
        <Column
          title="Año"
          dataIndex="year"
          key="year"
          sorter={(a: Project, b: Project) => new Date(a.year).getTime() - new Date(b.year).getTime()}
        />
        <Column
          title="Ubicación"
          dataIndex="location"
          key="location"
          onFilter={(value, record: Project) =>
            record.name.indexOf(value as any) === 0
          }
          sorter={(a, b) => a.location.length - b.location.length}
          sortDirections={['descend', 'ascend']}
        />
        <Column
          title="Superficie"
          dataIndex="surface"
          key="surface"
          sorter={(a: Project, b: Project) => a.surface - b.surface}
          render={value => `${value} m2`}
        />
        <Column
          title="Categorias"
          dataIndex="categories"
          key="categories"
          render={categories => (
            <>
              {categories.map(c => {
                return (
                  <Tag color={'#2db7f5'} key={c.id}>
                    {c.name.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          )}
        />
        <Column
          title="Acción"
          key="action"
          fixed="right"
          render={(record: Project) => (
            <Space size="middle">
              <Button
                icon={<EditFilled />}
                key={`btnEdit${record.id}`}
                type="dashed"
                shape="circle"
                onClick={() => editHandler(record)}
              />
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
          selectedProject
            ? `Editando Proyecto: ${selectedProject.name}`
            : 'Nuevo Proyecto'
        }
        visible={isVisible}
        footer={false}
        onCancel={() => {
          setProjectToEdit(null);
          setVisibility(false);
        }}
        destroyOnClose
        maskClosable={false}
        width={'42%'}
      >
        <DynamicProjectAddOrEdit
          project={selectedProject}
          setProject={setProjectToEdit}
          setVisible={setVisibility}
        />
      </Modal>
    </div>
  );
};

export default React.memo(Projects);