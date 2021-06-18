import { PictureOutlined } from '@ant-design/icons';
import {
  List,
  Card,
  Typography,
  Space,
  Checkbox,
  Dropdown,
  Menu,
  Button,
  Image as AntdImage,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Image,
  useDeleteImageMutation,
  useDeleteImagesMutation,
  useGetProjectImagesQuery,
  useSetAsPortraitMutation,
} from '../../../../../../generated/graphql';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';

const { Text } = Typography;

interface ProjectImagesProps {
  projectId: string | null;
  portraitId?: string | null;
}

const menu = (
  id: string,
  projectId: string,
  portraitId: string,
  selectHandler: (id: string) => void,
  isSelecting: boolean,
  singleDelete: (id: string) => Promise<void>,
  multipleDelete: () => Promise<void>,
  setPortrait: (id: string, projectId: string) => Promise<void>
) => (
  <Menu>
    {!isSelecting && (
      <Menu.Item key="1" onClick={() => selectHandler(id)}>
        Seleccionar
      </Menu.Item>
    )}
    {id !== portraitId && (
      <Menu.Item key="2" onClick={() => setPortrait(id, projectId)}>
        Convertir en Portada del Proyecto
      </Menu.Item>
    )}
    {!isSelecting ? (
      <Menu.Item key="3" onClick={() => singleDelete(id)}>
        Borrar
      </Menu.Item>
    ) : (
      <Menu.Item key="3" onClick={multipleDelete}>
        Borrar Seleccionadas
      </Menu.Item>
    )}
  </Menu>
);

const ProjectImages: React.FC<ProjectImagesProps> = ({
  projectId,
  portraitId,
}) => {
  const [{ data }] = useGetProjectImagesQuery({ variables: { id: projectId } });
  const [, deleteSingle] = useDeleteImageMutation();
  const [, deleteMultiple] = useDeleteImagesMutation();
  const [, setPortrait] = useSetAsPortraitMutation();
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<{}>();
  const [columns, setColumns] = useState(4);
  const [pageSize, setPageSize] = useState(8);

  const onProResize = () => {
    const width = window.innerWidth;
    switch (true) {
      case width <= 760:
        setColumns(1);
        setPageSize(2);
        break;
      case width <= 1250 && width > 760:
        setColumns(2);
        setPageSize(4);
        break;
      case width <= 1700 && width > 1250:
        setColumns(3);
        setPageSize(6);
        break;
      default:
        setColumns(4);
        setPageSize(8);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', onProResize, {passive: true});
    onProResize();
    return () => {
      window.removeEventListener('resize', onProResize);
    };
  }, []);

  const onMenuSelectHandler = (id: string) => {
    setSelectedImages(prevValue => {
      const newValue = { ...prevValue };
      newValue[id] = true;
      return newValue;
    });
    setSelecting(true);
  };

  const cancelHandler = () => {
    setSelectedImages({});
    setSelecting(false);
  };

  const checkHandler = (id: string) => {
    if (selectedImages[id]) {
      setSelectedImages(prevValue => {
        const newValue = { ...prevValue };
        newValue[id] = false;
        return newValue;
      });
      return;
    } else {
      setSelectedImages(prevValue => {
        const newValue = { ...prevValue };
        newValue[id] = true;
        return newValue;
      });
    }
  };

  const portraitHandler = async (id: string, projectId: string) => {
    const response = await setPortrait({ id, projectId });

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `La imagen no pudo ser establecida como portada.
        ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Edición Completa',
        `Imagen establecida como portada del proyecto ${response.data.setPortraitToProject.name}.`
      );
    }
  };

  const deleteHandler = async (id: string) => {
    const response = await deleteSingle({ id });

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `La imagen no pudo ser borrada.
        ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'Imagen borrada correctamente.'
      );
    }
  };

  const multipleDeleteHandler = async () => {
    const imageIds: string[] = [];
    for (let key in selectedImages) {
      selectedImages[key] === true ? imageIds.push(key) : '';
    }
    const response = await deleteMultiple({ ids: imageIds });

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `Las imagenes no pudieron ser borradas.
        ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Borrado completo',
        'Las imagenes fueron borradas correctamente.'
      );
    }
    cancelHandler();
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {isSelecting && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 0 20px 0',
          }}
        >
          <Button onClick={cancelHandler}>Cancelar</Button>
          <Button type="primary" danger onClick={multipleDeleteHandler}>
            Borrar Seleccionadas
          </Button>
        </div>
      )}
      <List
        style={{ height: '85%' }}
        grid={{ gutter: 16, column: columns }}
        dataSource={data?.project.images}
        pagination={{
          position: 'bottom',
          style: { position: 'absolute', right: 0, bottom: -20 },
          responsive: true,
          pageSize: pageSize,
          simple: true,
          hideOnSinglePage: true,
        }}
        renderItem={(item: Image) => (
          <List.Item>
            <Dropdown
              overlay={menu(
                item.id,
                projectId,
                portraitId,
                onMenuSelectHandler,
                isSelecting,
                deleteHandler,
                multipleDeleteHandler,
                portraitHandler
              )}
              trigger={['contextMenu']}
            >
              <Card
                key={item.id}
                style={{ height: '280px', overflow: 'hidden' }}
                bodyStyle={{
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: 0,
                  maxHeight: '30%',
                  border: 'none',
                  width: '100%',
                  padding: '12px 12px',
                }}
                cover={
                  <AntdImage
                    src={`${item.path}/${item.fileName}-w300.webp`}
                    preview={{src: `${item.path}/${item.fileName}.webp`}}
                    style={{
                      height: '250px',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                }
              >
                <Text>
                  <Space size="large">
                    <strong>Nombre de Archivo:</strong>
                    {item.fileName}
                    {portraitId === item.id && (
                      <PictureOutlined
                        style={{ marginLeft: 'auto', fontSize: 18 }}
                      />
                    )}
                  </Space>
                </Text>
                <br />
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: isSelecting ? 'space-between' : 'flex-end',
                    marginTop: 5,
                  }}
                >
                  {isSelecting && (
                    <Checkbox
                      id={item.id}
                      checked={selectedImages[item.id]}
                      onClick={() => checkHandler(item.id)}
                    />
                  )}
                  <Text strong type="secondary">
                    {new Date(parseInt(item.createdAt)).toLocaleString()}
                  </Text>
                </div>
              </Card>
            </Dropdown>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProjectImages;
