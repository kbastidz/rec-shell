import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import SecurityRecommendationCard from './RecommendationInfo';
import { SignInProps } from '../types/auth';

export const SignIn: React.FC<SignInProps> = ({
  onSignIn,
  onForgotPassword,
  loading = false,
  error,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  const validateForm = () => {
    const errors = {
      username: '',
      password: '',
    };

    if (!formData.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !onSignIn) return;

    try {
      setIsSubmitting(true);
      await onSignIn(formData);
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 h-full">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <div className="bg-blue-600 text-white px-3 py-2 rounded inline-flex items-center">
                <span className="font-bold text-base mr-2">PW</span>
                <span className="text-sm font-medium">Portal Web</span>
              </div>
            </div>

            {/* Login Form */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión</h1>
              <p className="text-gray-600 text-sm mb-8">
                Ingresa tu usuario y contraseña.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div>
                      <p className="text-red-800 font-medium">Error de autenticación</p>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6 mb-8">
                <div>                  
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="w-full px-3 py-3 border  rounded-md focus:border-teal-500 focus:ring-1  outline-none transition-colors"
                      placeholder="Usuario"
                    />
                  </div>
                  {formErrors.username && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="w-full px-3 py-3 border  rounded-md focus:border-teal-500 focus:ring-1  outline-none transition-colors"
                    placeholder="Contraseña"
                  />
                  {formErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !formData.username || !formData.password}
                className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-8 hover:bg-blue-700 hover:shadow-md"
              >
                Ingresar
              </button>

              
              <div className="flex space-x-4">
                <button 
                  disabled={isLoading}
                  onClick={onForgotPassword}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center text-sm border border-gray-200"
                >
                  <Lock className="w-5 h-5 mr-3 text-gray-500" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-medium">Recordar</div>
                    <div className="font-medium">Contraseña</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Info Cards */}
        <div className="w-1/2 bg-gray-50 px-8 py-12 h-full flex flex-col justify-center">          
           <SecurityRecommendationCard />
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 px-8 text-center">        
        <p className="text-gray-500 text-xs">
          © 2025 <strong>KbzO Computer</strong> - Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default SignIn;