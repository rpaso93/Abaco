import { CheckOutlined } from '@ant-design/icons';
import { Button, Form as AntdForm } from 'antd';
import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { OperationResult } from 'urql';
import {
  CreateProjectMutation,
  Exact,
  Project,
  ProjectInput,
  UpdateProjectMutation,
  useCreateProjectMutation,
  useGetCategoriesQuery,
  useUpdateProjectMutation,
} from '../../../../../../generated/graphql';
import DatePicker from '../../../../../UI/FormFields/DatePicker';
import Input from '../../../../../UI/FormFields/Input';
import Select from '../../../../../UI/FormFields/Select';
import ContentEditor from '../../../../../UI/ContentEditor/ContentEditor';
import { openNotificationWithIcon } from '../../../../../UI/Notifacion/Notifcation';
import { projectSchema } from '../../../../../../../utils/validations';
import { convertFromHTML, ContentState, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface ProjectAddOrEditProps {
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormItem = AntdForm.Item;

const labelCol = { span: 5 };
const wrapperCol = { span: 16 };

const ProjectAddOrEdit: React.FC<ProjectAddOrEditProps> = ({
  project,
  setVisible,
  setProject,
}) => {
  const [{ data: categoriesData }] = useGetCategoriesQuery();
  const [, updateProject] = useUpdateProjectMutation();
  const [, createProject] = useCreateProjectMutation();

  const submitProject = async values => {
    const htmlOutput = stateToHTML(
      values.input.description.getCurrentContent()
    );
    const response = project
      ? await updateProject({
          id: project.id,
          input: { ...values.input, year: values.input.year, description: htmlOutput },
        })
      : await createProject({
          input: { ...values.input, year: values.input.year, description: htmlOutput },
        });

    if (response.error) {
      openNotificationWithIcon(
        'error',
        'Hubo un problema',
        `El proyecto no pudo ser ${
          project ? 'actualizado' : 'creado'
        }. ERROR: ${response.error.message}.`
      );
      return;
    }
    if (response.data) {
      openNotificationWithIcon(
        'success',
        'Edición Completa',
        project
          ? `El proyecto con nombre '${
              (
                response as OperationResult<
                  UpdateProjectMutation,
                  Exact<{
                    id: string;
                    input: ProjectInput;
                  }>
                >
              ).data.updateProject.name
            }' fue actualizado correctamente.`
          : `El proyecto con nombre '${
              (
                response as OperationResult<
                  CreateProjectMutation,
                  Exact<{
                    input: ProjectInput;
                  }>
                >
              ).data.createProject.name
            }' fue creado correctamente.`
      );
    }
    if (project) {
      setProject(null);
    }
    setVisible(false);
  };

  const getFromHtml = (html: string) => {
    const blocksFromHTML = convertFromHTML(html);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(state);
  };

  const description = project
    ? getFromHtml(project.description)
    : EditorState.createEmpty();

  return (
    <Formik
      initialValues={{
        input: {
          name: project ? project.name : '',
          description: description,
          year: project ? moment(project.year) : moment(),
          location: project ? project.location : '',
          surface: project ? project.surface : 0,
          categories: project
            ? project.categories.map(category => category.id)
            : [],
        },
      }}
      validationSchema={projectSchema}
      onSubmit={values => submitProject(values)}
      validateOnBlur
    >
      {({ setFieldValue, errors, touched, isSubmitting, values }) => (
        <Form
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Input
            name="input.name"
            label="Nombre"
            type="input"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.name}
            touched={touched?.input?.name}
          />
          <ContentEditor
            name="input.description"
            editorState={values.input.description}
            setEditorState={setFieldValue}
          />
          <DatePicker
            name="input.year"
            label="Fecha"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            setField={setFieldValue}
            required
          />
          <Input
            name="input.surface"
            label="Superficie"
            type="number"
            setField={setFieldValue}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.surface}
            touched={touched?.input?.surface}
          />
          <Input
            name="input.location"
            label="Ubicación"
            type="input"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            required
            error={errors?.input?.location}
            touched={touched?.input?.location}
          />
          {categoriesData?.categories && (
            <Select
              name="input.categories"
              label="Categorias"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              required
              multiple
              setField={setFieldValue}
              data={categoriesData.categories}
              error={errors?.input?.categories}
              touched={touched?.input?.categories}
              type="categories"
            />
          )}
          <FormItem style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {project ? 'Guardar cambios' : 'Crear proyecto'}
            </Button>
          </FormItem>
        </Form>
      )}
    </Formik>
  );
};

export default ProjectAddOrEdit;
