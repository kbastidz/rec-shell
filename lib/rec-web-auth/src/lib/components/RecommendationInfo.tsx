import React from 'react';
import { Smartphone } from 'lucide-react';

interface SecurityRecommendationCardProps {
  className?: string;
}

export const SecurityRecommendationCard: React.FC<SecurityRecommendationCardProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={className}>
      {/* Tarjeta de Recomendación de Seguridad */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">
          Recomendación de seguridad
        </h2>
        
        <div className="flex items-start">
          <div className="w-4 h-4 bg-gray-400 rounded mr-3 mt-1 flex-shrink-0"></div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              No Compartas tu usuario o contraseña
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Para tu seguridad, no los compartas con nadie ni los uses en sitios no verificados.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de Aplicación Móvil */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-blue-500 rounded mr-3 mt-1 flex-shrink-0 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Acceso al sistema
            </h3>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              Conéctate y gestiona tu información de forma rápida y confiable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityRecommendationCard;