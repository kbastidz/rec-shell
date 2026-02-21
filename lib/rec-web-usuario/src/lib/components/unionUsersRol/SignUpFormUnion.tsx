import React, { useEffect } from 'react';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Group,
  Stack,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconMail, IconUser, IconPhone, IconId } from '@tabler/icons-react';
import { ActionButtons, NOTIFICATION_MESSAGES, SignUpFormValues, signUpValidations, useNotifications } from '@rec-shell/rec-web-shared';
import { SignUpFormProps } from '../../types/auth.types';
import { useSignUp } from '../../hooks/useSignUp';
import { FormErrorAlert } from '../common/FormErrorAlert';
import { useRoleManagement } from '../../hooks/useRoleManagement';
import { RoleSelector } from '../users/ROLE/RoleSelector';



interface ExtendedSignUpFormProps extends SignUpFormProps {
  onNavigateToUsers?: () => void;
}

export const SignUpFormUnion: React.FC<ExtendedSignUpFormProps> = ({ 
  onSuccess, onNavigateToUsers 
}) => {
  const { signUp, loading, error, setError } = useSignUp();
  const { availableRoles, fetchAvailableRoles, updateAssingRole } = useRoleManagement();
  const notifications = useNotifications();
  

  useEffect(() => {
    fetchAvailableRoles();
  }, [fetchAvailableRoles]);

 

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      roleId: null as number | null,
    },
    validate: {
      ...signUpValidations,
      roleId: (value) => (!value ? 'Debes seleccionar un rol' : null),
    },
  });

   useEffect(() => {
  form.setFieldValue('username', form.values.phoneNumber);
}, [form.values.phoneNumber]);

  const handleSubmit = async (values: typeof form.values) => {
  try {
    const { confirmPassword, roleId, ...submitData } = values;

    if (roleId === null) return;

    // 1. Crear usuario
    const newUser = await signUp(submitData);
    const userId = newUser.data?.userInfo.id;

    if (userId === undefined) return;

    // 2. Obtener los roles que el backend asignó por defecto
    /*await fetchUserRoles(Number(userId));

    // 3. Eliminar cada rol por defecto
    for (const defaultRole of userRoles) {
      await removeRole(Number(userId), defaultRole.id);
    }
    await new Promise(resolve => setTimeout(resolve, 500));*/

    // 4. Asignar el rol seleccionado
    await updateAssingRole(Number(userId), roleId);

    notifications.success(
      NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_USER_EMAIL.title,
      NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_USER_EMAIL.message,
      <IconCheck />
    );

    onSuccess?.(values.username);
  } catch (err) {
    console.error('Error en registro:', err);
  }
};

  const handleNavigateClick = () => {
    if (onNavigateToUsers) {
      onNavigateToUsers();
    } 
  };

  return (
    <div className="w-full mx-auto">
      <Paper withBorder p={40} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Group justify="space-between" align="center" mb="md">
          <Title>Crear Cuenta</Title>
          
          <ActionButtons.Save 
            onClick={() => form.onSubmit(handleSubmit)()} 
            loading={loading} 
          />
        </Group>

        <FormErrorAlert error={error} onClose={() => setError('')} />

        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Tu apellido"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Email"
                placeholder="@hotmail.com"
                required
                leftSection={<IconMail size="1rem" />}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Cedula"
                placeholder="0993696714"
                required
                leftSection={<IconId  size="1rem" />}
                {...form.getInputProps('phoneNumber')}
              />
            </Group>

            <Group grow>
              <TextInput
  label="Nombre de usuario"
  placeholder="Se llenará automáticamente con tu cédula"
  required
  disabled                         
  leftSection={<IconUser size="1rem" />}
  {...form.getInputProps('username')}
/>
            </Group>

            <Group grow>
              <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                required
                {...form.getInputProps('password')}
              />
              <PasswordInput
                label="Confirmar contraseña"
                placeholder="Confirma tu contraseña"
                required
                {...form.getInputProps('confirmPassword')}
              />
            </Group>

            {/* Rol */}
            <RoleSelector
              roles={availableRoles}
              selectedRoleId={form.values.roleId}
              onSelectRole={(roleId) => form.setFieldValue('roleId', roleId)}
            />
          </Stack>
        </Box>
      </Paper>
    </div>
  );
};

