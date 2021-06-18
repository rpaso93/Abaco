import React, { useEffect, useState } from 'react';
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons';
import {
  Form as AntdForm,
  Space,
  Typography,
  Upload as AntdUpload,
} from 'antd';
import { getBase64 } from '../../../../utils/files';
import { FormikErrors, FormikTouched } from 'formik';
import { UploadFile } from 'antd/lib/upload/interface';

const FormItem = AntdForm.Item;
const { Text } = Typography;

interface UploadProps {
  name: string;
  file?: any;
  setField?: (field: string, value: any, shouldValidate?: boolean) => void;
  required: boolean;
  error?: string | string[] | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any>[];
}

const Upload: React.FC<UploadProps> = ({
  name,
  file,
  setField,
  required,
  error,
  touched,
}) => {
  const [fileUrl, setFileUrl] = useState<string>(null);

  const getFileUrl = async (file: UploadFile<any>) => {
    const newUrl = await getBase64(file.originFileObj);
    setFileUrl(newUrl as string);
  };

  return (
    <FormItem required={required}>
      <AntdUpload
        type="drag"
        accept="image/*"
        maxCount={1}
        fileList={[file]}
        showUploadList={false}
        beforeUpload={file => {
          return false;
        }}
        name={name}
        onChange={async e => {
          setField(name, e.fileList[0]);
          await getFileUrl(e.fileList[0]);
        }}
      >
        {fileUrl === null ? (
          <Space direction="vertical" size="large" style={{ padding: '2rem' }}>
            <PlusOutlined
              style={{ fontSize: 52, color: 'rgba(75,75,75,.9)' }}
            />
            <Text>Clickea o arrastra el archivo para cargarlo</Text>
          </Space>
        ) : (
          <div
            style={{
              height: 250,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={fileUrl}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
            <Space direction='vertical' style={{ position: 'absolute', zIndex: 5 }}>
              <RetweetOutlined style={{fontSize: 40, color: 'white'}}/>
              <Text style={{ color: 'white' }}>
                Clickea o arrastra para cambiar el archivo
              </Text>
            </Space>
          </div>
        )}
      </AntdUpload>
      {error && touched ? (
        <Text type="danger" style={{ padding: 5 }}>
          {error}
        </Text>
      ) : null}
    </FormItem>
  );
};

export default Upload;
