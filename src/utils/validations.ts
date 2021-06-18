import * as Yup from 'yup';

export const projectSchema = Yup.object().shape({
  input: Yup.object().shape({
    name: Yup.string()
      .min(5, 'El nombre debe contener al menos 5 letras')
      .required('El nombre es necesario'),
    year: Yup.date().required('Por favor seleccione la fecha del proyecto'),
    location: Yup.string()
      .min(5, 'La ubicación debe contener al menos 5 letras')
      .matches(/^[\w ,]+$/, {
        message: 'La ubicación solo puede contener "." y ","',
      })
      .required('La ubicación es necesaria'),
    surface: Yup.number()
      .moreThan(0, 'Debe ser mayor a 0')
      .positive('Debe ser un numero positivo'),
    categories: Yup.array()
      .min(1, `Debe seleccionar al menos una categoria`)
      .required('Es necesario seleccionar alguna categoria'),
  }),
});

export const userSchema = Yup.object().shape({
  input: Yup.object().shape({
    email: Yup.string()
      .email('Ingrese un email válido')
      .matches(/^[\w .-_@]+$/, {
        message: 'El email sólo puede contener . / - / _',
      })
      .required('El email es necesario'),
    password: Yup.string()
      .min(8, 'La contraseña debe tener un minimo de 8 caracteres.')
      .matches(/^[\w @$!%*#?&]+$/, {
        message:
          'La contraseña sólo puede contener letras, números y alguno de los siguientes caracteres (@$!%*#?&)',
      })
      .required('La contraseña es necesaria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('Es necesario confirmar la contraseña'),
    name: Yup.string()
      .matches(/^[a-zA-Z-\s]+$/, {
        message: 'El nombre sólo puede contener letras',
      })
      .required('El nombre es necesario'),
    lastname: Yup.string()
      .matches(/^[a-zA-Z-\s]+$/, {
        message: 'El apellido sólo puede contener letras',
      })
      .required('El apellido es necesario'),
    role: Yup.number().required('Es necesario asignar un rol'),
  }),
});

export const userUpdateSchema = Yup.object().shape({
  input: Yup.object().shape({
    email: Yup.string()
      .email('Ingrese un email válido')
      .matches(/^[\w .-_@]+$/, {
        message: 'El email solo puede contener . / - / _',
      })
      .required('El email es necesario'),
    name: Yup.string()
      .matches(/^[a-zA-Z-\s]+$/, {
        message: 'El nombre sólo puede contener letras',
      })
      .required('El nombre es necesario'),
    lastname: Yup.string()
      .matches(/^[a-zA-Z-\s]+$/, {
        message: 'El apellido sólo puede contener letras',
      })
      .required('El apellido es necesario'),
    role: Yup.number().required('Es necesario asignar un rol'),
  }),
});

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'La contraseña debe tener un minimo de 8 caracteres.')
    .matches(/^[\w @$!%*#?&]+$/, {
      message:
        'La contraseña sólo puede contener letras, números y alguno de los siguientes caracteres (@$!%*#?&)',
    })
    .required('La contraseña es necesaria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Es necesario confirmar la contraseña'),
});

export const loginSchema = Yup.object().shape({
  input: Yup.object().shape({
    email: Yup.string()
      .email('Ingrese un email válido')
      .required('Por favor escriba un email'),
    password: Yup.string().required('Por favor escriba su contraseña'),
  }),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Ingrese un email válido')
    .required('Por favor escriba un email'),
});

export const contactSchema = Yup.object().shape({
  input: Yup.object().shape({
    name: Yup.string().required('Por favor escriba su nombre'),
    email: Yup.string()
      .email('Ingrese un email válido')
      .required('Por favor escriba un email'),
    issue: Yup.string().required('Por favor escriba el asunto'),
    content: Yup.string().required('Por favor escriba su consulta'),
  }),
});
