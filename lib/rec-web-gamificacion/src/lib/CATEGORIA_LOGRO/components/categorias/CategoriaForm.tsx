// components/categorias/CategoriaForm.tsx
import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  ColorPicker,
  NumberInput,
  Switch,
  Button,
  Group,
  Stack,
  Text,
  Avatar,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconPhoto, IconStar } from '@tabler/icons-react';
import { CategoriaLogro } from '../../../types/model';
import { CategoriaInput } from '../../services/gamificacion.service';

interface CategoriaFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CategoriaInput, id?: string) => void | Promise<void>;
  categoria?: CategoriaLogro | null;
  loading?: boolean;
}

const COLORES_PREDEFINIDOS: string[] = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#AED6F1', '#A9DFBF', '#F8C471', '#D7BDE2'
];

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ 
  opened, 
  onClose, 
  onSubmit, 
  categoria = null, 
  loading = false 
}) => {
  const [colorPersonalizado, setColorPersonalizado] = useState<string>('#4ECDC4');
  
  const form = useForm<CategoriaInput>({
    initialValues: {
      nombre: '',
      nombreMostrar: '',
      descripcion: '',
      urlIcono: '',
      color: '#4ECDC4',
      ordenClasificacion: 0,
      estaActivo: true,
    },
    validate: {
      nombre: (value: string) => 
        !value?.trim() || value.trim().length < 2 ? '🤔 El nombre debe tener al menos 2 caracteres' : null,
      nombreMostrar: (value: string) => 
        !value?.trim() || value.trim().length < 2 ? '😊 El nombre para mostrar debe tener al menos 2 caracteres' : null,
      descripcion: (value: string | undefined) => {
        if (value && value.trim().length > 0 && value.trim().length < 5) {
          return '📝 La descripción debe tener al menos 5 caracteres si la proporcionas';
        }
        return null;
      },
      ordenClasificacion: (value: number) => 
        value < 0 ? '🔢 El orden debe ser un número positivo' : null,
      urlIcono: (value: string | undefined) => {
        if (value && value.trim() !== '') {
          const urlPattern = /^https?:\/\/.+/;
          return !urlPattern.test(value) ? '🔗 Debe ser una URL válida (http:// o https://)' : null;
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (categoria && opened) {
      const formValues: CategoriaInput = {
        nombre: categoria.nombre || '',
        nombreMostrar: categoria.nombreMostrar || '',
        descripcion: categoria.descripcion || '',
        urlIcono: categoria.urlIcono || '',
        color: categoria.color || '#4ECDC4',
        ordenClasificacion: categoria.ordenClasificacion || 0,
        estaActivo: categoria.estaActivo ?? true,
      };
      
      form.setValues(formValues);
      setColorPersonalizado(categoria.color || '#4ECDC4');
    } else if (!categoria && opened) {
      form.reset();
      setColorPersonalizado('#4ECDC4');
    }
  }, [categoria, opened]);

  const handleSubmit = (values: CategoriaInput) => {
    const cleanedValues: CategoriaInput = {
      nombre: values.nombre?.trim() || '',
      nombreMostrar: values.nombreMostrar?.trim() || '',
      descripcion: values.descripcion?.trim() || undefined,
      urlIcono: values.urlIcono?.trim() || undefined,
      color: values.color?.trim() || undefined,
      ordenClasificacion: values.ordenClasificacion || 0,
      estaActivo: values.estaActivo ?? true,
    };
    
    onSubmit(cleanedValues, categoria?.id);
  };

  const handleClose = () => {
    form.reset();
    setColorPersonalizado('#4ECDC4');
    onClose();
  };

  const handleColorChange = (color: string) => {
    setColorPersonalizado(color);
    form.setFieldValue('color', color);
  };

  const handlePredefinedColorClick = (color: string) => {
    form.setFieldValue('color', color);
    setColorPersonalizado(color);
  };

  const isEditing = Boolean(categoria);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group align="center">
          <Avatar color={form.values.color} radius="md">
            <IconStar size="1.2rem" />
          </Avatar>
          <Text size="lg" fw={600}>
            {isEditing ? '✏️ Editar Categoría' : '🌟 Nueva Categoría'}
          </Text>
        </Group>
      }
      size="md"
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.5 }}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert 
            icon={<IconInfoCircle size="1rem" />} 
            color="blue" 
            variant="light"
            radius="md"
          >
            <Text size="sm">
              {isEditing 
                ? '¡Vamos a actualizar esta categoría! 🚀' 
                : '¡Vamos a crear una nueva categoría súper genial! ✨'
              }
            </Text>
          </Alert>

          <TextInput
            label="🏷️ Nombre interno"
            placeholder="ejemplo: categoria_matematicas"
            description="Usado internamente por el sistema (sin espacios, usar guiones bajos)"
            required
            {...form.getInputProps('nombre')}
            radius="md"
            disabled={loading}
          />

          <TextInput
            label="📢 Nombre para mostrar"
            placeholder="Matemáticas Divertidas"
            description="Nombre que verán los niños en la aplicación"
            required
            {...form.getInputProps('nombreMostrar')}
            radius="md"
            disabled={loading}
          />

          <Textarea
            label="📝 Descripción (opcional)"
            placeholder="Una descripción genial que motive a los niños..."
            description="Descripción motivadora para inspirar a los estudiantes"
            minRows={3}
            maxRows={5}
            {...form.getInputProps('descripcion')}
            radius="md"
            disabled={loading}
          />

          <TextInput
            label="🖼️ URL del ícono (opcional)"
            placeholder="https://ejemplo.com/icono.png"
            description="URL de una imagen que represente la categoría"
            leftSection={<IconPhoto size="1rem" />}
            {...form.getInputProps('urlIcono')}
            radius="md"
            disabled={loading}
          />

          <div>
            <Text size="sm" fw={500} mb="xs">
              🎨 Color de la categoría (opcional)
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              Elige un color que identifique esta categoría
            </Text>
            
            <Group gap="xs" mb="sm">
              {COLORES_PREDEFINIDOS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePredefinedColorClick(color)}
                  disabled={loading}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: form.values.color === color ? '3px solid #228BE6' : '2px solid #dee2e6',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: loading ? 0.6 : 1,
                  }}
                  title={`Seleccionar color ${color}`}
                />
              ))}
            </Group>

            <ColorPicker
              value={colorPersonalizado}
              onChange={handleColorChange}
              size="sm"
              swatches={[]}
              withPicker
            />
          </div>

          <NumberInput
            label="🔢 Orden de clasificación"
            placeholder="0"
            description="Número que determina el orden de aparición (0 = primero)"
            min={0}
            max={999}
            {...form.getInputProps('ordenClasificacion')}
            radius="md"
            disabled={loading}
          />

          <Switch
            label="✅ ¿Está activa?"
            description="Las categorías activas aparecen en la aplicación"
            {...form.getInputProps('estaActivo', { type: 'checkbox' })}
            disabled={loading}
          />

          <Group justify="flex-end" gap="md" mt="lg">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              radius="md"
              disabled={loading}
            >
              ❌ Cancelar
            </Button>
            
            <Button
              type="submit"
              loading={loading}
              color={isEditing ? 'blue' : 'green'}
              radius="md"
            >
              {isEditing ? '💾 Actualizar' : '🎉 Crear Categoría'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};