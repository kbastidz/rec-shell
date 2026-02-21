import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { SecurityRecommendationCard, SupportCard } from './RecommendationInfo';
import ImageCarousel from './ImageCarousel';

interface SignInData {
  username: string;
  password: string;
}

interface FormErrors {
  username: string;
  password: string;
}

interface SignInProps {
  onSignIn?: (data: SignInData) => void | Promise<void>;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignIn = (data: SignInData) => console.log('Sign in:', data),
  onForgotPassword = () => console.log('Forgot password'),
  loading = false,
  error = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInData>({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: '',
    password: '',
  });
  const [showError, setShowError] = useState<boolean>(!!error);


  const validateForm = () => {
    const errors: FormErrors = {
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

  const handleInputChange = (field: keyof SignInData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isLoading = loading || isSubmitting;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo - Formulario */}
        <div className="flex-1 flex items-center justify-center px-8  h-full">
          <div className="w-full max-w-md">
            

            {/* Formulario con fondo */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
                Bienvenido
              </h1>
              <p className="text-gray-600 text-sm mb-8">
                Ingresa tus credenciales para continuar
              </p>

              {showError && error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-pulse">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-red-800 font-medium text-sm">Error de autenticación</p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5 mb-6">
                {/* Campo Usuario */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed group-hover:border-gray-300"
                      placeholder="Ingresa tu usuario"
                    />
                  </div>
                  {formErrors.username && (
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <span className="mr-1" role="img" aria-label="">⚠️</span>  
                      {formErrors.username}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed group-hover:border-gray-300 pr-12"
                      placeholder="Ingresa tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-2 flex items-center">
                      <span className="mr-1" role="img" aria-label="">⚠️</span>  
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón Ingresar */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !formData.username || !formData.password}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transform"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Ingresando...
                  </div>
                ) : (
                  'Ingresar'
                )}
              </button>

              {/* Botón Recuperar Contraseña */}
              <button 
                disabled={isLoading}
                onClick={onForgotPassword}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 hover:shadow-md group"
              >
                <Lock className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium">¿Olvidaste tu contraseña?</div>
                  <div className="font-semibold text-gray-700">Recuperar acceso</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full flex flex-col">    
              <div className="space-y-6 max-w-lg">
<ImageCarousel />
              </div>
  
</div>

        {/* Panel Derecho - Info Cards 
        <div className="w-1/2 px-8  h-full flex flex-col justify-center overflow-y-auto">          
           <div className="space-y-6 max-w-lg">
             {/*<SecurityRecommendationCard />
             <SupportCard />
             <ImageCarousel />}
             <ImageCarousel />
           </div>
        </div>
        */}
      </div>

      {/* Footer mejorado */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 px-8 text-center">        
        <p className="text-gray-600 text-sm">
          © 2025 <strong className="text-gray-900">Computer</strong> - Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default SignIn;