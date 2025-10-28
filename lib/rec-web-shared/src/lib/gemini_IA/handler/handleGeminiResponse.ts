/**
 * Limpia y parsea una respuesta textual (por ejemplo de Gemini o GPT)
 * asegurando que esté en formato JSON y manejando errores de forma controlada.
 *
 * Totalmente genérica, sin dependencias.
 */

interface HandleSuccessOptions<T> {
  text: string;
  onParsed: (data: T) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

/**
 * Procesa texto generado por un modelo y lo convierte a un objeto JSON.
 * Usa genéricos para inferir el tipo del resultado.
 */
export function handleModelResponse<T>({
  text,
  onParsed,
  onError,
  onFinally,
}: HandleSuccessOptions<T>): void {
  try {
    if (!text) throw new Error('Texto vacío recibido.');

    let cleanedText = text.trim();

    // Quitar delimitadores Markdown (```json ... ```)
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    cleanedText = cleanedText.trim();
    console.log('🧹 Texto limpio (primeros 200 chars):', cleanedText.substring(0, 200) + '...');

    // Intentar parsear JSON
    const parsedData = JSON.parse(cleanedText) as T;
    onParsed(parsedData);
    console.log('✅ Texto parseado correctamente.');
  } catch (err) {
    console.error('❌ Error al procesar respuesta del modelo:', err);
    onError?.(err);
  } finally {
    onFinally?.();
  }
}

/**
 * Maneja errores genéricos con fallback opcional.
 */
export function handleModelError<T>(
  error: unknown,
  fallback: T | null,
  setResult: (data: T | null) => void
): void {
  console.error('❌ Error al generar texto del modelo:', error);
  if (fallback !== null) {
    console.warn('⚠️ Usando datos de respaldo (fallback).');
    setResult(fallback);
  } else {
    setResult(null);
  }
}
