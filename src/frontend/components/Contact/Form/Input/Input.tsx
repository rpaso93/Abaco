import { Field } from 'formik';
import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  name: string;
  label: string;
  textBox?: boolean;
  flex?: boolean;
  err?: string;
}

const Input: React.FC<InputProps> = ({ name, label, textBox, flex, err }) => {
  const style = [styles.InputContainer];

  if (textBox) {
    style.push(styles.WithTextBox);
  }
  if(err){
    style.push(styles.Error)
  }

  return (
    <>
      <div className={style.join(' ')} style={{ flex: flex ? 0.8 : '' }}>
        <Field name={name}>
          {({ field }) => (
            <>
              {!textBox ? (
                <input {...field} type="text" name={name} id={name} required />
              ) : (
                <textarea {...field} id={name} required />
              )}
              <label htmlFor={name}>
                <span>{err ? err : label}</span>
              </label>
            </>
          )}
        </Field>
      </div>
    </>
  );
};

export default Input;
