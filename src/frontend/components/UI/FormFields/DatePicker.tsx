import React from 'react';
import { ColProps, DatePicker as AntdDatePicker, Form } from 'antd';
import { Field } from 'formik';

const FormItem = Form.Item;

interface DatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  type?: 'year' | 'week' | 'month' | 'quarter';
  setField: (field: string, value: any, shouldValidate?: boolean) => void;
  labelCol: ColProps;
  wrapperCol: ColProps;
}

const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label,
  setField,
  type,
  labelCol,
  wrapperCol,
  required,
}) => {
  return (
    <FormItem
      label={label}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      required={required}
    >
      <Field name={name}>
        {({ field }) => (
          <AntdDatePicker
            {...field}
            picker={type ? type : null}
            onChange={(date, dateString) => setField(name, date)}
          />
        )}
      </Field>
    </FormItem>
  );
};

export default DatePicker;
