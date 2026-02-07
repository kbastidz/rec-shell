import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Alert,
  Group,
  Box,
  Center,
  rem,
  LoadingOverlay,
  Divider,
  ThemeIcon,
  Transition,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle, useTimeout } from '@mantine/hooks';
import {
  IconLock,
  IconUser,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconBrandGoogle,
  IconBrandFacebook,
  IconInfoCircle,
  IconShieldLock,
  IconBook,
} from '@tabler/icons-react';

interface SignInData {
  username: string;
  password: string;
}

interface SignInProps {
  onSignIn?: (data: SignInData) => void | Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  logo?: React.ReactNode;
  companyName?: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignIn = (data: SignInData) => console.log('Sign in:', data),
  onForgotPassword = () => console.log('Forgot password'),
  
  loading = false,
  error = null,
  logo,
  companyName = 'Computer',
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, toggleShowPassword] = useToggle();
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      username: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return 'El nombre de usuario es requerido';
        if (trimmed.length < 3)
          return 'El nombre de usuario debe tener al menos 3 caracteres';
        if (!/^[a-zA-Z0-9_.@-]+$/.test(trimmed))
          return 'Solo se permiten letras, números y los caracteres .@-_';
        if (
          trimmed.includes('@') &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        ) {
          return 'Por favor ingresa un email válido';
        }
        return null;
      },
      password: (value) => {
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8)
          return 'La contraseña debe tener al menos 8 caracteres';

        // Validaciones de seguridad progresivas
        if (loginAttempts > 2) {
          const errors = [];
          if (!/(?=.*[A-Z])/.test(value)) errors.push('una mayúscula');
          if (!/(?=.*\d)/.test(value)) errors.push('un número');
          if (!/(?=.*[!@#$%^&*])/.test(value))
            errors.push('un carácter especial');

          if (errors.length > 0) {
            return `Debe contener al menos: ${errors.join(', ')}`;
          }
        }
        return null;
      },
    },
  });

  // Auto-ocultar notificación de éxito
  useTimeout(() => setShowSuccess(false), 5000);

  const handleSubmit = async (values: typeof form.values) => {
    if (!onSignIn) return;

    try {
      setIsSubmitting(true);
      await onSignIn({
        username: values.username.trim(),
        password: values.password,
      });
      setLoginAttempts(0);
      setShowSuccess(true);
    } catch (err) {
      setLoginAttempts((prev) => prev + 1);
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

 

  const isLoading = loading || isSubmitting;
  const isLocked = loginAttempts >= 5;
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Educational Watermark Background */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)',
        }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.08 }}
        >
          <defs>
            <pattern
              id="educationalPattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              {/* Libro */}
              <path
                d="M30,40 L30,80 L70,80 L70,40 L30,40 M35,40 L35,80 M30,50 L70,50 M30,60 L70,60 M30,70 L70,70"
                stroke="#667eea"
                strokeWidth="2"
                fill="none"
              />
              {/* Graduación */}
              <path
                d="M150,50 L170,40 L190,50 L190,60 L170,70 L150,60 Z M165,60 L165,75 M175,60 L175,75"
                stroke="#764ba2"
                strokeWidth="2"
                fill="none"
              />
              {/* Átomo */}
              <ellipse
                cx="50"
                cy="150"
                rx="20"
                ry="8"
                stroke="#667eea"
                strokeWidth="2"
                fill="none"
                transform="rotate(60 50 150)"
              />
              <ellipse
                cx="50"
                cy="150"
                rx="20"
                ry="8"
                stroke="#667eea"
                strokeWidth="2"
                fill="none"
                transform="rotate(-60 50 150)"
              />
              <circle
                cx="50"
                cy="150"
                r="3"
                fill="#764ba2"
              />
              {/* Lápiz */}
              <path
                d="M160,130 L170,120 L175,125 L165,135 Z M160,130 L155,135 L158,138 L165,135"
                stroke="#667eea"
                strokeWidth="2"
                fill="none"
              />
              {/* Microscopio simplificado */}
              <path
                d="M110,140 L110,165 M105,165 L115,165 M110,140 L120,130 M120,130 L125,135"
                stroke="#764ba2"
                strokeWidth="2"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#educationalPattern)" />
        </svg>
      </Box>

      {/* Success Affix Notification */}
      <Container size={420} my={40} px="xs" style={{ position: 'relative', zIndex: 1 }}>
        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          withBorder
          style={{
            backgroundColor: 'white',
            borderColor: 'rgba(102, 126, 234, 0.1)',
          }}
        >
          <Box pos="relative">
            <LoadingOverlay
              visible={isLoading}
              zIndex={1000}
              overlayProps={{
                radius: 'md',
                blur: 2,
                backgroundOpacity: 0.6,
              }}
              loaderProps={{
                type: 'bars',
                size: 'lg',
                color: '#667eea',
              }}
            />

            <Stack gap="lg">
            {/* Header */}
            <Box ta="center">
              <Center mb="md">
                {logo || (
                  <ThemeIcon
                    size={rem(80)}
                    radius="50%"
                    variant="gradient"
                    gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                  >
                    <IconBook size={40} stroke={1.5} />
                  </ThemeIcon>
                )}
              </Center>

              <Title
                order={2}
                ta="center"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 800,
                  marginBottom: rem(4),
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                }}
              >
                Bienvenido de vuelta
              </Title>

              <Text c="dimmed" size="sm" ta="center" fw={500}>
                Ingresa a tu cuenta para continuar
              </Text>
            </Box>

            {/* Error Alert */}
            <Transition mounted={!!error} transition="fade" duration={200}>
              {(styles) => (
                <Alert
                  icon={<IconAlertCircle size={18} />}
                  title="Error de autenticación"
                  color="red"
                  variant="light"
                  radius="md"
                  withCloseButton
                  style={styles}
                >
                  {error}
                  {loginAttempts > 2 && (
                    <Text size="xs" mt="xs" component="div">
                      <Group gap={4}>
                        <IconInfoCircle size={12} />
                        <span>Has intentado {loginAttempts} veces</span>
                      </Group>
                    </Text>
                  )}
                </Alert>
              )}
            </Transition>

            {/* Lock Warning */}
            <Transition mounted={isLocked} transition="scale-y" duration={300}>
              {(styles) => (
                <Alert
                  icon={<IconAlertCircle size={18} />}
                  title="Cuenta temporalmente bloqueada"
                  color="orange"
                  variant="light"
                  radius="md"
                  style={styles}
                >
                  <Text size="sm">
                    Demasiados intentos fallidos. Por seguridad, tu cuenta ha
                    sido bloqueada temporalmente.
                  </Text>
                  <Text size="xs" mt="xs" c="dimmed">
                    Intenta de nuevo en 15 minutos o recupera tu contraseña.
                  </Text>
                </Alert>
              )}
            </Transition>

            {/* Password Strength Hint */}
            <Transition
              mounted={loginAttempts > 2}
              transition="slide-down"
              duration={300}
            >
              {(styles) => (
                <Paper withBorder p="xs" radius="md" bg="blue.0" style={styles}>
                  <Group gap="xs">
                    <IconInfoCircle size={16} color="#228be6" />
                    <Text size="xs" c="blue">
                      Para mayor seguridad, asegúrate que tu contraseña
                      contenga:
                    </Text>
                  </Group>
                  <Text size="xs" c="blue" ml={24} mt={4}>
                    • Al menos 8 caracteres • Una mayúscula • Un número • Un
                    carácter especial
                  </Text>
                </Paper>
              )}
            </Transition>

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label={
                    <Group gap={4}>
                      <Text fw={600} size="sm">
                        Usuario
                      </Text>
                      <Tooltip label="Puedes usar tu nombre de usuario ">
                        <IconInfoCircle size={14} color="gray" />
                      </Tooltip>
                    </Group>
                  }
                  placeholder="usuario"
                  size="md"
                  leftSection={<IconUser size={18} />}
                  disabled={isLoading || isLocked}
                  radius="md"
                  withAsterisk
                  styles={{
                    input: {
                      transition:
                        'border-color 0.2s ease, box-shadow 0.2s ease',
                      '&:focus': {
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                      },
                    },
                  }}
                  {...form.getInputProps('username')}
                />

                <PasswordInput
                  label={
                    <Group justify="space-between" w="100%">
                      <Text fw={600} size="sm">
                        Contraseña
                      </Text>
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={onForgotPassword}
                        disabled={isLoading}
                        color="blue"
                        px={0}
                        rightSection={<IconLock size={14} />}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </Group>
                  }
                  placeholder="••••••••"
                  size="md"
                  leftSection={<IconLock size={18} />}
                  rightSection={
                    <Tooltip
                      label={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => toggleShowPassword()}
                        disabled={isLoading}
                        color="gray"
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword ? (
                          <IconEyeOff size={16} />
                        ) : (
                          <IconEye size={16} />
                        )}
                      </Button>
                    </Tooltip>
                  }
                  disabled={isLoading || isLocked}
                  radius="md"
                  withAsterisk
                  visible={showPassword}
                  styles={{
                    input: {
                      transition:
                        'border-color 0.2s ease, box-shadow 0.2s ease',
                      '&:focus': {
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                      },
                    },
                  }}
                  {...form.getInputProps('password')}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={isLoading}
                  disabled={isLocked}
                  radius="md"
                  variant="gradient"                  
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar a mi cuenta'}
                </Button>
              </Stack>
            </form>
          </Stack>
          </Box>
        </Paper>

        {/* Footer */}
        <Box ta="center" mt="xl" p="md">
          <Text
            c="dimmed"
            size="sm"
            style={{
              opacity: 0.8,
              lineHeight: 1.6,
            }}
          >
            © {currentYear}{' '}
            <Text span fw={700} c="blue">
              {companyName}
            </Text>{' '}
            - Todos los derechos reservados.
            <br />
            <Text size="xs" mt={4} c="gray.6">
              Sistema seguro • Versión 1.0.0 • Última actualización:{' '}
              {new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;