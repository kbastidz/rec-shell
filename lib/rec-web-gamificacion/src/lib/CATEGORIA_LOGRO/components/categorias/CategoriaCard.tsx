// components/categorias/CategoriaCard.jsx
import { Card, Group, Text, ActionIcon, Badge, Avatar, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconStar } from '@tabler/icons-react';
import { CategoriaLogro } from '../../../types/model';

interface CategoriaCardProps {
  categoria: CategoriaLogro;
  onEdit: (categoria: CategoriaLogro) => void;
  onDelete: (id: string | number, nombre: string) => void;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({ categoria, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(categoria);
  };

  const handleDelete = () => {
    onDelete(categoria.id, categoria.nombreMostrar);
  };

  // Función para obtener color con fallback
  const obtenerColor = () => {
    return categoria.color || '#667eea';
  };

  // Función para obtener contraste de texto basado en el color de fondo
  const obtenerColorTexto = () => {
    const color = obtenerColor();
    // Si el color es muy oscuro, usar texto claro
    if (color === '#000000' || color.toLowerCase().includes('dark')) {
      return 'white';
    }
    return 'dark';
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        background: `linear-gradient(135deg, ${obtenerColor()}15 0%, ${obtenerColor()}08 100%)`,
        border: `2px solid ${obtenerColor()}30`,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${obtenerColor()}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <Group justify="space-between" align="flex-start" mb="xs">
        <Group align="center" gap="md">
          {categoria.urlIcono ? (
            <Avatar
              src={categoria.urlIcono}
              size="lg"
              radius="md"
              alt={categoria.nombreMostrar}
              style={{
                border: `2px solid ${obtenerColor()}`,
              }}
            />
          ) : (
            <Avatar 
              size="lg" 
              radius="md" 
              style={{
                backgroundColor: obtenerColor(),
                color: 'white',
              }}
            >
              <IconStar size="1.5rem" />
            </Avatar>
          )}
          
          <div>
            <Text 
              size="lg" 
              fw={600} 
              c={obtenerColorTexto()}
              mb={4}
            >
              {categoria.nombreMostrar}
            </Text>
            <Badge 
              color={categoria.estaActivo ? 'green' : 'red'} 
              variant="light"
              size="sm"
            >
              {categoria.estaActivo ? '✅ Activa' : '❌ Inactiva'}
            </Badge>
          </div>
        </Group>
        
        <Group gap="xs">
          <Tooltip label="Editar categoría" position="top" withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              radius="md"
              onClick={handleEdit}
              style={{
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <IconEdit size="1.1rem" />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Eliminar categoría" position="top" withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              radius="md"
              onClick={handleDelete}
              style={{
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <IconTrash size="1.1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {categoria.descripcion && (
        <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
          {categoria.descripcion}
        </Text>
      )}

      <Group justify="space-between" align="center" mt="md">
        <Badge 
          variant="outline" 
          color="gray" 
          size="sm"
          style={{
            borderColor: obtenerColor(),
            color: obtenerColor(),
          }}
        >
          📊 Orden: {categoria.ordenClasificacion || 'N/A'}
        </Badge>
        
        <Group gap="xs" align="center">
          <Text size="xs" c="dimmed">
            🏆 {categoria.logros?.length || 0} logros
          </Text>
        </Group>
      </Group>

      {/* Indicador visual si la categoría tiene muchos logros */}
      {categoria.logros && categoria.logros.length > 10 && (
        <Badge
          variant="filled"
          color="gold"
          size="xs"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          🌟 Popular
        </Badge>
      )}
    </Card>
  );
};