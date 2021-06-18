import { Field } from 'formik';
import {
  ColProps,
  Form as AntdForm,
  Input as AntdInput,
  InputNumber,
  Typography
} from 'antd';

const FormItem = AntdForm.Item;
const { Text } = Typography;

interface InputProps {
  name: string;
  label?: string;
  required?: boolean;
  type: 'input' | 'textarea' | 'number' | 'password';
  setField?: (field: string, value: any, shouldValidate?: boolean) => void;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  height?: string;
  email?: boolean;
  prefix?: React.ReactNode;
  className?: string;
  error: string | undefined;
  touched: boolean;
  justPlaceholder?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  required,
  type,
  setField,
  labelCol,
  wrapperCol,
  height,
  email,
  prefix,
  className,
  error,
  touched,
  justPlaceholder
}) => {
  const InputField = field => {
    if (type === 'textarea')
      return (
        <AntdInput.TextArea
          {...field}
          placeholder={label}
          style={{ height: height }}
          required
        />
      );
    if (type === 'password')
      return (
        <AntdInput.Password
          {...field}
          prefix={prefix}
          placeholder={label}
          required
        />
      );
    if (type === 'number')
      return (
        <InputNumber
          {...field}
          placeholder={label}
          onChange={e => setField(name, e)}
          style={{ width: 162 }}
          min={1}
          formatter={value => `${value} m2`}
          parser={value => value.replace('m2', '')}
        />
      );
    return (
      <AntdInput
        {...field}
        prefix={prefix}
        placeholder={label}
        type={email ? 'email' : ''}
        required
      />
    );
  };

  return (
    <FormItem
      label={!justPlaceholder ? label: null}
      required={required}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      className={className}
      validateStatus={error && touched ? 'error' : 'success'}
    >
      <Field name={name}>{({ field }) => InputField(field)}</Field>
      {error && touched ? <Text type='danger' style={{padding: 5}}>{error}</Text> : null}
    </FormItem>
  );
};

export default Input;
