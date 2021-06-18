import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ColProps, Form as AntdForm, Modal, Typography, Upload as AntdUpload } from 'antd';
import { getBase64 } from '../../../../utils/files';
import { FormikErrors, FormikTouched } from 'formik';

const FormItem = AntdForm.Item;
const { Text } = Typography;

interface UploadProps {
  name: string;
  label: string;
  files?: any[];
  setField?: (field: string, value: any, shouldValidate?: boolean) => void;
  required: boolean;
  error?: string | string[] | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any>[];
  labelCol?: ColProps;
  wrapperCol?: ColProps;
}

const Upload: React.FC<UploadProps> = ({
  name,
  label,
  files,
  setField,
  required,
  error,
  touched,
  labelCol,
  wrapperCol
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  return (
    <FormItem
      label={label}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      required={required}
    >
      <AntdUpload
        fileList={files}
        multiple
        listType="picture-card"
        accept="image/*"
        beforeUpload={file => {
          return false;
        }}
        onPreview={handlePreview}
        onChange={e => {
          setField(name, e.fileList);
        }}
      >
        {files?.length < 10 && UploadButton}
      </AntdUpload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            height: '70vh',
            width: '100%',
            objectFit: 'contain',
          }}
          src={previewImage}
        />
      </Modal>
      {error && touched ? <Text type="danger" style={{padding: 5}}>{error}</Text> : null}
    </FormItem>
  );
};

const UploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Agregar Imagen</div>
  </div>
);

export default Upload;
