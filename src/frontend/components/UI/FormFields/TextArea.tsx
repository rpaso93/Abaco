import { Field } from 'formik';
import {
  Form as AntdForm,
  Input as AntdInput,
  Typography,
} from 'antd';
import React from 'react';

const FormItem = AntdForm.Item;
const { Text } = Typography;

interface TextAreaProps {
  name: string;
  label?: string;
  required?: boolean;
  email?: boolean;
  prefix?: React.ReactNode;
  error?: string | undefined;
  touched?: boolean;
  style?: React.CSSProperties;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  required,
  error,
  touched,
  style
}) => {

  return (
    <FormItem
      required={required}
      validateStatus={error && touched ? 'error' : 'success'}
    >
      <Field name={name}>
        {({ field }) => (
          <AntdInput.TextArea
            {...field}
            
            style={style}
            required
          />
        )}
      </Field>
      {error && touched ? (
        <Text type="danger" style={{ padding: 5 }}>
          {error}
        </Text>
      ) : null}
    </FormItem>
  );
};

export default TextArea;
