import React, { useState } from 'react';
import { Button, Input, Tabs, Form as AntdForm } from 'antd';
import { useGetSectionsQuery } from '../../../../../generated/graphql';
import intStyles from '../Interface.module.css';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Formik, Form } from 'formik';
import Upload from '../../../../UI/FormFields/Upload';
import PagesForm from './PagesForm';

const { TabPane } = Tabs;

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  const [{ data }] = useGetSectionsQuery();

  const qSomosIndex = data?.sections?.findIndex(
    item => item.id === 'quienes_somos'
  );

  return (
    <div className={intStyles.Container}>
      <Tabs type="line" centered tabBarStyle={{height: 35, marginBottom: 2, marginTop: 0}} destroyInactiveTabPane>
        <TabPane tab="Home" key="1">
          <Tabs
            style={{ textTransform: 'capitalize' }}
            tabBarStyle={{height: 35}}
            type="line"
            centered
            destroyInactiveTabPane
          >
            {data?.sections
              ?.filter(item => item.id !== 'quienes_somos')
              .reverse()
              .map((item, index) => (
                <TabPane tab={item.id} key={3 + index} style={{overflowY: 'hidden'}}>
                  <PagesForm page={item} />
                </TabPane>
              ))}
          </Tabs>
        </TabPane>
        <TabPane tab="Quienes Somos" key="2">
          <PagesForm page={data?.sections[qSomosIndex]} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default React.memo(Page);
