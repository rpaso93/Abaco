import React, { useState } from 'react';
import { Button, Card, Form as AntdForm, Typography, Space } from 'antd';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Formik, Form } from 'formik';
import Upload from '../../../../UI/FormFields/Upload2';
import {
  useUpdateSectionMutation,
  Section,
} from '../../../../../generated/graphql';
import ContentEditor from '../../../../UI/ContentEditor/ContentEditor';
import { convertFromHTML, EditorState } from 'draft-js';
import { ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import user from '../../../../../../server/resolver/user';
import { openNotificationWithIcon } from '../../../../UI/Notifacion/Notifcation';

const FormItem = AntdForm.Item;
const { Text } = Typography;

interface PagesFormProps {
  page: Section;
}

const PagesForm: React.FC<PagesFormProps> = ({ page }) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [, update] = useUpdateSectionMutation();

  const handleClick = () => {
    setEditing(prevState => !prevState);
  };

  const getFromHtml = (html: string) => {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(state);
  };

  const contenido = page.contenido
    ? getFromHtml(page.contenido)
    : EditorState.createEmpty();

  return (
    <div
      style={{
        width: '100%',
        height: page.id.includes('_') ? '77vh' : '73vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: page.id.includes('_') ? 'center' : 'flex-start',
        overflowY: 'auto',
        textTransform: 'none',
      }}
    >
      {editing ? (
        <Formik
          initialValues={{
            id: page.id,
            file: {} as any,
            contenido,
          }}
          onSubmit={async values => {
            const htmlOutput = stateToHTML(
              values.contenido.getCurrentContent()
            );
            const file =
              Object.entries(values.file).length === 1
                ? null
                : values.file.originFileObj;
            const response = await update({
              ...values,
              file: file,
              contenido: htmlOutput,
            });

            if (response.error) {
              openNotificationWithIcon(
                'error',
                'Hubo un problema',
                'Lo sentimos, la seccion no pudo ser actualizada.'
              );
              return;
            }
            if (response.data) {
              openNotificationWithIcon(
                'success',
                'Edición Completa',
                `La seccion ${response.data.updateSection.id} fue actualizada correctamente.`
              );
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Upload
                name="file"
                required
                setField={setFieldValue}
                file={values.file}
              />
              {page.id !== 'portada' && (
                <ContentEditor
                  name="contenido"
                  editorState={values.contenido}
                  setEditorState={setFieldValue}
                />
              )}
              <FormItem style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Button
                  loading={isSubmitting}
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  disabled={isSubmitting}
                >
                  Guardar Cambios
                </Button>
              </FormItem>
            </Form>
          )}
        </Formik>
      ) : (
        <Card
          style={{ width: '100%', height: '80%' }}
          headStyle={{ fontWeight: 600, fontSize: 18 }}
          title={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Button
                icon={
                  <EditOutlined
                    style={{ fontSize: 18 }}
                    onClick={handleClick}
                  />
                }
                type="link"
                shape="circle"
              />
            </div>
          }
          bodyStyle={{ display: page.contenido ? '' : 'none' }}
          cover={
            <img
              src={page.img ? page.img + '-w900.webp' : ''}
              style={{
                maxHeight: page.contenido ? 300 : 'none',
                objectFit: 'cover',
              }}
            />
          }
        >
          {page.contenido && (
            <div dangerouslySetInnerHTML={{ __html: page.contenido }}></div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PagesForm;
