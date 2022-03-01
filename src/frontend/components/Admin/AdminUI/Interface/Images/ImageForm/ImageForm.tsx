import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Form as AntdForm } from 'antd';
import Select from '../../../../../UI/FormFields/Select';
import { CheckOutlined } from '@ant-design/icons';
import {
  useAddImageToProjectMutation,
  useGetProjectsNamesQuery,
} from '../../../../../../generated/graphql';
import Upload from '../../../../../UI/FormFields/Upload';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';
import { UploadFile } from 'antd/lib/upload/interface';

const FormItem = AntdForm.Item;

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };

interface ImageFormProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageForm: React.FC<ImageFormProps> = ({ setVisible }) => {
  const [{ data }] = useGetProjectsNamesQuery();
  const [, upload] = useAddImageToProjectMutation();

  const submitImage = async (values: { id: string; files: any[] }) => {
    const response = await upload({
      id: values.id,
      files: values.files.map((file: UploadFile) => file.originFileObj),
    });
    
    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `Las imagenes no pudieron ser cargadas en el servidor.
        ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Subida completa',
        `${
          values.files.length > 1
            ? 'Las imagenes fueron subidas y asociadas'
            : 'La imagen fue subida y asociada'
        }  al proyecto ${response.data.addImageToProject.name} correctamente.`
      );
    }
    setVisible(false);
  };

  return (
    <Formik
      initialValues={{ id: '', files: [] }}
      onSubmit={values => submitImage(values)}
      validateOnBlur
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Select
            name="id"
            label="Proyecto"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            setField={setFieldValue}
            data={data.projects}
            error={errors?.id}
            touched={touched?.id}
            type="projects"
          />
          <Upload
            name="files"
            label="Fotos"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            setField={setFieldValue}
            files={values.files}
            error={errors?.files}
            touched={touched?.files}
          />
          <FormItem style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Subir Imagenes
            </Button>
          </FormItem>
        </Form>
      )}
    </Formik>
  );
};

export default ImageForm;
