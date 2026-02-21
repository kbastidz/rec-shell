import React from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Carousel } from '@mantine/carousel';
import { Paper, Title, Text } from '@mantine/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import '@mantine/carousel/styles.css';

import slide1 from '../../assets/images/img1.jpeg';
import slide2 from '../../assets/images/img2.jpeg';

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
    //image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    image: slide1,
    title: '',
    description: ''
  },
  {
    //image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    image: slide2,
    title: '',
    description: ''
  }
];

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  slides = defaultSlides 
}) => {
  return (
    <div className="w-full">
      <Carousel
        withIndicators
        withControls
        classNames={{
          root: ' overflow-hidden shadow-2xl',
          control: 'bg-white/90 hover:bg-white border-none text-gray-800 data-[inactive=true]:invisible data-[inactive=true]:cursor-default',
          indicator: 'w-3 h-3 transition-all bg-white/50 data-[active=true]:bg-white data-[active=true]:w-8',
          indicators: 'bottom-4 gap-2',
        }}
        slideSize="100%"
        height={700}
        slideGap="md"
        controlsOffset="xs"
        
      >
        {slides.map((slide, index) => (
          <Carousel.Slide key={index} className="h-full">
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
                {/*<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />*/}
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