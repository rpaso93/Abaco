import { List, Card, Typography, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useGetProjectsImageQuery } from '../../../../../generated/graphql';
import Actions from '../../../../UI/Actions/Actions';
import { filterData } from '../filterData';
import intStyles from '../Interface.module.css';
import ProjectCover from './ProjectCover/ProjectCover';
import ProjectImages from './ProjectImages/ProjectImages';
import ImageForm from './ImageForm/ImageForm';

const { Text } = Typography;

const Images: React.FC<{}> = ({}) => {
  const [{ data }] = useGetProjectsImageQuery();
  const [columns, setColumns] = useState(4);
  const [pageSize, setPageSize] = useState(8);
  const [selectedProject, setProject] = useState(null);
  const [isVisible, setVisibility] = useState<boolean>(false);
  const [filter, setFilter] = useState('');

  const onImgResize = () => {
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
    window.addEventListener('resize', onImgResize, {passive: true});
    onImgResize();
    return () => {
      window.removeEventListener('resize', onImgResize);
    };
  }, []);

  const cardClick = item => {
    setProject(item);
    setVisibility(true);
  };

  return (
    <div className={intStyles.Container}>
      <Actions filter={setFilter} action={setVisibility} type="image" />
      <List
        style={{ height: '85%', padding: 10 }}
        grid={{ gutter: 16, column: columns }}
        dataSource={
          !filter ? data?.projects : filterData(filter, data.projects)
        }
        pagination={{
          position: 'bottom',
          style: { position: 'absolute', right: 0, bottom: 0 },
          responsive: true,
          pageSize: pageSize,
          simple: true,
          hideOnSinglePage: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} proyectos`,
        }}
        renderItem={item => (
          <List.Item>
            <Card
              onClick={() => cardClick(item)}
              hoverable
              style={{ height: '250px', overflow: 'hidden' }}
              bodyStyle={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                maxHeight: '28%',
                border: 'none',
                width: '100%',
                padding: '12px 24px',
              }}
              cover={
                <ProjectCover
                  image={
                    item.portraitId
                      ? item.images?.find(img => img.id === item.portraitId)
                      : item.images?.sort(
                          (a, b) => b.createdAt - a.createdAt
                        )[0]
                  }
                />
              }
            >
              <Text ellipsis>
                <Space size="small">
                  <strong>Proyecto:</strong> {item.name}
                </Space>
              </Text>
              <br />
              <Text ellipsis>
                {item.images && item.images.length > 0 ? (
                  <Space size="small">
                    <strong>Cantidad de Imagenes:</strong> {item.images.length}
                  </Space>
                ) : (
                  <strong>No tiene imagenes</strong>
                )}
              </Text>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={
          selectedProject
            ? `Imagenes de Proyecto: ${selectedProject?.name}`
            : 'Cargar imagenes'
        }
        visible={isVisible}
        footer={false}
        onCancel={() => {
          setProject(null);
          setVisibility(false);
        }}
        destroyOnClose
        style={{ top: 20 }}
        width={selectedProject ? '70%' : '50%'}
        maskClosable={false}
      >
        {selectedProject ? (
          <ProjectImages
            projectId={selectedProject.id}
            portraitId={selectedProject.portraitId}
          />
        ) : (
          <ImageForm setVisible={setVisibility} />
        )}
      </Modal>
    </div>
  );
};

export default React.memo(Images);
