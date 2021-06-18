import React from 'react';
import {
  DeleteFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Input as AntdInput } from 'antd';
import styles from './Actions.module.css';

interface ActionsProps {
  filter: React.Dispatch<React.SetStateAction<string>>;
  action: React.Dispatch<React.SetStateAction<boolean>>;
  delete?: () => Promise<void>;
  selectedRows?: any[];
  type: 'user' | 'project' | 'image';
}

const Actions: React.FC<ActionsProps> = ({
  filter,
  action,
  delete: deleteHandler,
  selectedRows,
  type,
}) => {
  const labels = getLabels(type);

  return (
    <>
      <div className={styles.Actions}>
        <AntdInput.Search
          style={{ width: '40%' }}
          allowClear
          enterButton
          placeholder="Buscar por..."
          onSearch={(value: string) => filter(value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => action(true)}
        >
          Agregar {labels?.addBtn}
        </Button>
      </div>
      {type != 'image' && <Popconfirm
        title={`Estas seguro de borrar ${labels?.confirm} seleccionados?`}
        onConfirm={() => deleteHandler()}
        okText="Si"
        cancelText="No"
        disabled={!!!selectedRows.length}
      >
        <Button
          style={{ alignSelf: 'flex-start', margin: '1rem 0' }}
          type="primary"
          danger
          icon={<DeleteFilled />}
          disabled={!!!selectedRows.length}
        >
          Borrar {labels?.delBtn}
        </Button>
      </Popconfirm>}
    </>
  );
};

const getLabels = (type: 'user' | 'project' | 'image') => {
  switch (type) {
    case 'user':
      return { addBtn: 'Usuario', delBtn: 'Usuarios', confirm: 'los usuarios' };
    case 'project':
      return {
        addBtn: 'Proyecto',
        delBtn: 'Proyectos',
        confirm: 'los proyectos',
      };
    case 'image':
      return {
        addBtn: 'Imagenes',
        delBtn: '',
        confirm: '',
      };
  }
};

export default Actions;
