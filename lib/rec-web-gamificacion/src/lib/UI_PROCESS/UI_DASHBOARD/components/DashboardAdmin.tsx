import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Award, Zap, Users, Activity, BarChart3 } from 'lucide-react';
import { TransaccionPuntos } from '../dtos/dashboard';
import { useTransaccionesPuntos } from '../hook/useDashboard';


// MOCK DATA
const MOCK_TRANSACCIONES: TransaccionPuntos[] = [
  {
    cantidad: 10,
    creado_en: "2025-10-28 21:38:07.5566",
    usuario_id: 1,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 7 preguntas",
    metadatos: { precision: 129, mejor_racha: 3, preguntas_respondidas: 7 }
  },
  {
    cantidad: 4,
    creado_en: "2025-10-28 22:13:42.933039",
    usuario_id: 1,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Historia y Sociedad",
    metadatos: { emoji: "📜", materia: "Historia y Sociedad" }
  },
  {
    cantidad: 15,
    creado_en: "2025-10-29 10:20:15.123",
    usuario_id: 1,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 10 preguntas",
    metadatos: { precision: 180, mejor_racha: 5, preguntas_respondidas: 10 }
  },
  {
    cantidad: 8,
    creado_en: "2025-10-29 14:30:22.456",
    usuario_id: 2,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Ciencias",
    metadatos: { emoji: "🔬", materia: "Ciencias" }
  },
  {
    cantidad: 12,
    creado_en: "2025-10-30 09:15:33.789",
    usuario_id: 2,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 8 preguntas",
    metadatos: { precision: 150, mejor_racha: 4, preguntas_respondidas: 8 }
  },
  {
    cantidad: 6,
    creado_en: "2025-10-30 16:45:11.234",
    usuario_id: 3,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Arte",
    metadatos: { emoji: "🎨", materia: "Arte" }
  },
  {
    cantidad: 20,
    creado_en: "2025-10-31 11:22:44.567",
    usuario_id: 3,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 15 preguntas",
    metadatos: { precision: 200, mejor_racha: 7, preguntas_respondidas: 15 }
  },
  {
    cantidad: 5,
    creado_en: "2025-10-31 18:30:55.891",
    usuario_id: 1,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Deportes",
    metadatos: { emoji: "⚽", materia: "Deportes" }
  },
  {
    cantidad: 18,
    creado_en: "2025-11-01 08:10:20.345",
    usuario_id: 2,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 12 preguntas",
    metadatos: { precision: 195, mejor_racha: 6, preguntas_respondidas: 12 }
  },
  {
    cantidad: 7,
    creado_en: "2025-11-01 20:50:30.678",
    usuario_id: 3,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Geografía",
    metadatos: { emoji: "🌍", materia: "Geografía" }
  },
  {
    cantidad: 3,
    creado_en: "2025-11-01 13:25:15.234",
    usuario_id: 4,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Música",
    metadatos: { emoji: "🎵", materia: "Música" }
  },
  {
    cantidad: 14,
    creado_en: "2025-11-02 15:40:50.567",
    usuario_id: 4,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 9 preguntas",
    metadatos: { precision: 165, mejor_racha: 5, preguntas_respondidas: 9 }
  }
];

interface DashboardAdminProps {
  transacciones?: TransaccionPuntos[];
  useMockData?: boolean; // Nueva prop para controlar el modo
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ 
  transacciones: transaccionesProp, 
  useMockData = false // Por defecto usa mock data
}) => {
  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
  const [graficoActivo, setGraficoActivo] = useState(0);

  // Decide qué datos usar: mock o reales
  const transaccionesActivas = useMockData ? MOCK_TRANSACCIONES : (transaccionesProp || []);

  // Usa el hook custom para procesar los datos
  const datosGraficos = useTransaccionesPuntos();

  const graficos = [
    {
      titulo: "1. Distribución de Puntos por Tipo",
      icono: <Award className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={datosGraficos.datosPorTipo}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: any) => {
                const { name, percent } = props;
                return `${name}: ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {datosGraficos.datosPorTipo.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "2. Evolución Temporal de Puntos",
      icono: <TrendingUp className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosGraficos.evolucionTemporal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="puntos" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "3. Puntos por Período del Día",
      icono: <Calendar className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGraficos.puntosPorPeriodo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="puntos" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "4. Ranking de Usuarios Top",
      icono: <Users className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGraficos.rankingUsuarios} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="usuario" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="puntos" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "5. TRIVIA: Precisión vs Puntos",
      icono: <Zap className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="precision" name="Precisión" />
            <YAxis dataKey="puntos" name="Puntos" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Trivia" data={datosGraficos.triviaPrecision} fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "6. Frecuencia de Transacciones por Tipo",
      icono: <Activity className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGraficos.frecuenciaTipo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      titulo: "7. Distribución de Cantidad de Puntos",
      icono: <BarChart3 className="w-5 h-5" />,
      componente: (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGraficos.distribucionPuntos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rango" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frecuencia" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Dashboard de Transacciones de Puntos
          </h1>
          <p className="text-slate-600">Análisis completo de actividad y rendimiento</p>
          {useMockData && (
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Modo Demo - Datos de prueba
            </span>
          )}
        </div>

        {/* Navegación de gráficos */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {graficos.map((grafico, idx) => (
            <button
              key={idx}
              onClick={() => setGraficoActivo(idx)}
              className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                graficoActivo === idx
                  ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow'
              }`}
            >
              {grafico.icono}
              <span className="text-xs font-semibold text-center">
                Gráfico {idx + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Gráfico activo */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            {graficos[graficoActivo].icono}
            {graficos[graficoActivo].titulo}
          </h2>
          {graficos[graficoActivo].componente}
        </div>

        {/* Resumen estadístico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Total Puntos</div>
            <div className="text-3xl font-bold text-violet-600">
              {datosGraficos.estadisticasResumen.totalPuntos}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Transacciones</div>
            <div className="text-3xl font-bold text-pink-600">
              {datosGraficos.estadisticasResumen.totalTransacciones}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Usuarios Activos</div>
            <div className="text-3xl font-bold text-emerald-600">
              {datosGraficos.estadisticasResumen.usuariosActivos}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Promedio por Trans.</div>
            <div className="text-3xl font-bold text-blue-600">
              {datosGraficos.estadisticasResumen.promedioPorTransaccion.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};