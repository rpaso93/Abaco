import React, { HTMLAttributes, ReactElement, useState } from 'react';
import { LazyMotion, m, domAnimation, AnimatePresence } from 'framer-motion';
import styles from './Box.module.css';
import { CloseOutlined } from '@ant-design/icons';

interface BoxProps {
  children: ReactElement;
  label: string;
  labelSide: 'right' | 'left' | 'top' | 'bottom';
  show: React.Dispatch<React.SetStateAction<"projects" | "description">>;
  value: 'projects' | 'description';
}

const setVariants = (labelSide: 'right' | 'left' | 'top' | 'bottom') => {
  switch (labelSide) {
    case 'right':
      return {
        animate: { x: 0 },
        initAndEnd: { x: '100%' },
        style: styles.Right,
      };
    case 'left':
      return {
        animate: { x: 0 },
        initAndEnd: { x: '-100%' },
        style: styles.Left,
      };
    case 'top':
      return {
        animate: { y: 0 },
        initAndEnd: { y: '-100%' },
        style: styles.Top,
      };
    case 'bottom':
      return {
        animate: { y: '0' },
        initAndEnd: { y: '100%' },
        style: styles.Bottom,
      };
  }
};

const Box: React.FC<BoxProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  label,
  labelSide,
  show,
  value,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const labelStyle = [styles.Label];

  const openHandler = () => {
    setOpen(prevValue => !prevValue);
    show(prevValue => prevValue !== null ? null : value)
  };

  const { animate, initAndEnd, style } = setVariants(labelSide);
  labelStyle.push(style);

  return (
    <div {...props} className={styles.Box}>
      <AnimatePresence exitBeforeEnter initial={false} presenceAffectsLayout>
        <LazyMotion features={domAnimation}>
          {open && (
            <m.div
              key={"Box"}
              transition={{ stiffness: 500, damping: 30 }}
              initial={initAndEnd}
              animate={animate}
              exit={initAndEnd}
              className={styles.Body}
            >
              <CloseOutlined
                style={{
                  fontSize: 20,
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                }}
                onClick={openHandler}
              />
              {children.type !== 'p' ? React.cloneElement(children, {close: openHandler}) : children}
            </m.div>
          )}
          {!open && (
            <m.span
              key="label"
              transition={{ stiffness: 500, damping: 30 }}
              initial={initAndEnd}
              animate={animate}
              exit={initAndEnd}
              className={labelStyle.join().replace(',', ' ')}
              onClick={openHandler} 
            >
              {label}
            </m.span>
          )}
        </LazyMotion>
      </AnimatePresence>
    </div>
  );
};

export default Box;
