import React from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Carousel } from '@mantine/carousel';
import { Paper, Title, Text } from '@mantine/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import '@mantine/carousel/styles.css';

interface CarouselSlide {
  image: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  slides?: CarouselSlide[];
}

const defaultSlides: CarouselSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    title: 'Aprende a tu Ritmo',
    description: 'Accede a contenido educativo diseñado para tu nivel y necesidades'
  },
  {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    title: 'Biblioteca Digital',
    description: 'Miles de recursos educativos al alcance de tu mano'
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop',
    title: 'Colaboración Estudiantil',
    description: 'Conecta con compañeros y aprende en comunidad'
  },
  {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    title: 'Educación Digital',
    description: 'Herramientas modernas para un aprendizaje efectivo'
  }
];

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  slides = defaultSlides 
}) => {
  return (
    <div className="w-full max-w-lg">
      <Carousel
        withIndicators
        withControls
        classNames={{
          root: 'rounded-3xl overflow-hidden shadow-2xl',
          control: 'bg-white/90 hover:bg-white border-none text-gray-800 data-[inactive=true]:invisible data-[inactive=true]:cursor-default',
          indicator: 'w-3 h-3 transition-all bg-white/50 data-[active=true]:bg-white data-[active=true]:w-8',
          indicators: 'bottom-4 gap-2',
        }}
        slideSize="100%"
        height={500}
        slideGap="md"
        controlsOffset="xs"
        
      >
        {slides.map((slide, index) => (
          <Carousel.Slide key={index}>
            <Paper
              className="relative h-full overflow-hidden"
              radius={0}
            >
              {/* Imagen de fondo */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Contenido del slide */}
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                {slide.title && (
                  <Title 
                    order={2} 
                    className="mb-3 text-white drop-shadow-lg"
                    style={{ fontSize: '2rem', fontWeight: 700 }}
                  >
                    {slide.title}
                  </Title>
                )}
                {slide.description && (
                  <Text 
                    size="lg" 
                    className="text-white/90 drop-shadow-md max-w-md"
                  >
                    {slide.description}
                  </Text>
                )}
              </div>
            </Paper>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;