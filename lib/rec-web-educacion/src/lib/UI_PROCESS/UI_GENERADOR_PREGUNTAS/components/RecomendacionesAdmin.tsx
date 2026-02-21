import React, { useState } from 'react';
import { MessageSquare, Star, X } from 'lucide-react';

import 'reactflow/dist/style.css';
import {
  handleModelResponse,
  service,
  useGemini,
} from '@rec-shell/rec-web-shared';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import {
  GENERADOR_MAPA,
  PROMP_MAPA_CONECPTUAL,
} from '../../../utils/CONSTANTE';
import { YoutubeVideo } from '../interfaces/interface';
import PlanTecnologia from './PlanTecnologia';

export interface Concept {
  name: string;
  description: string;
  relatedTo: number[];
}

export interface DataType {
  mainTopic: string;
  concepts: Concept[];
}

export function RecomendacionesAdmin() {
  const [inputText, setInputText] = useState('Técnicas de computación moderna');
  const [showResponse, setShowResponse] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showConceptMapModal, setShowConceptMapModal] = useState(false);

  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

  const [loading, setLoading] = useState(false);

  const [generatedConcepts, setGeneratedConcepts] = useState<DataType | null>(
    null
  );
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      setShowResponse(true);
      await fetchYoutubeVideos(inputText);
    }
  };

  const fetchYoutubeVideos = async (query: string) => {
    setLoading(true);
    try {
      const videos = await service.GET_NAME(query, 5);
      setVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const {
    loading: loadingGemini,
    error,
    generateText,
  } = useGemini({
    onSuccess: (text: any) =>
      handleModelResponse({
        text,
        onParsed: (data: DataType) => {
          setGeneratedConcepts(data);
          convertToReactFlowElements(data);
          setIsLoadingConcepts(false);
        },
        onError: (err) => {
          console.error('Error procesando conceptos:', err);
          setIsLoadingConcepts(false);
        },
        onFinally: () => {
          console.log('Finalizó el procesamiento del mapa conceptual');
        },
      }),
    onError: (err: string) => {
      console.error('Error en Gemini:', err);
      setGeneratedConcepts(GENERADOR_MAPA);
      convertToReactFlowElements(GENERADOR_MAPA);

      setIsLoadingConcepts(false);
    },
  });

  const convertToReactFlowElements = (data: DataType) => {
    if (!data || !data.concepts) return;

    const newNodes = [];
    //const newEdges = [];
    const newEdges: Edge[] = [];

    // Crear nodo principal centrado arriba
    const centerX = 600;
    const mainY = 50;

    if (data.mainTopic) {
      newNodes.push({
        id: 'main',
        type: 'default',
        data: { label: data.mainTopic },
        position: { x: centerX, y: mainY },
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: '3px solid #4c51bf',
          borderRadius: '15px',
          padding: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
          width: 260,
          //textAlign: 'center',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
    }

    // Calcular distribución horizontal de los conceptos
    const spacingX = 280; // separación horizontal
    const startX = centerX - ((data.concepts.length - 1) * spacingX) / 2;
    const conceptY = 250; // altura fija para todos los nodos hijos

    data.concepts.forEach((concept, index) => {
      const x = startX + index * spacingX;
      const nodeId = `concept-${index}`;

      newNodes.push({
        id: nodeId,
        type: 'default',
        data: {
          label: (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {concept.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {concept.description}
              </div>
            </div>
          ),
        },
        position: { x, y: conceptY },
        style: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          border: '2px solid #ec4899',
          borderRadius: '12px',
          padding: '15px',
          width: 250,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Línea desde el nodo principal
      newEdges.push({
        id: `edge-main-${nodeId}`,
        source: 'main',
        target: nodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6',
        },
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Generar mapa conceptual
  const handleGenerateConceptMap = async () => {
    if (!inputText.trim()) {
      alert('Por favor, escribe un tema en el cuadro de búsqueda primero');
      return;
    }

    setShowConceptMapModal(true);
    setIsLoadingConcepts(true);
    //Invocacion al pomp
    await generateText(PROMP_MAPA_CONECPTUAL(inputText));
  };

  const openVideoModal = async () => {
    if (!inputText.trim()) {
      alert('Por favor, escribe un tema en el cuadro de búsqueda primero');
      return;
    }

    setShowVideoModal(true);
    await fetchYoutubeVideos(inputText);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const closeConceptMapModal = () => {
    setShowConceptMapModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-purple-400 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-2xl md:text-3xl text-white font-semibold drop-shadow">
            ¿Hola, Qué te gustaría aprender hoy?
          </p>
        </div>

        {/* Robot Character */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl">
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-cyan-400"></div>
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-300 rounded-full"></div>

                <div className="w-40 h-32 bg-cyan-200 rounded-3xl border-4 border-cyan-400 flex items-center justify-center relative">
                  <div className="flex gap-8">
                    <div className="w-8 h-10 bg-blue-900 rounded-full relative">
                      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="w-8 h-10 bg-blue-900 rounded-full relative">
                      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 w-16 h-8 border-b-4 border-blue-900 rounded-b-full"></div>
                </div>

                <div className="absolute top-8 -left-12 w-10 h-10 bg-blue-500 rounded-full"></div>
                <div className="absolute top-8 -right-12 w-10 h-10 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div className="absolute top-20 -right-16 text-6xl animate-bounce">
              <span role="img" aria-label="candado">
                ✋
              </span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div>
            <label className="block text-gray-500 text-sm mb-2">
              Dime un tema que quieras aprender y te ayudaré a descubrir más.
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 text-xl text-gray-700 outline-none"
              />
              <button
                onClick={handleSubmit}
                className="p-3 hover:bg-gray-100 rounded-full transition"
              >
                <span role="img" aria-label="trueno">
                  ⚡
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Concept Map Card */}
          <div
            onClick={handleGenerateConceptMap}
            className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition transform"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Mapa</h3>
                <h4 className="text-3xl font-bold text-white">conceptual</h4>
              </div>
              <div className="bg-yellow-300 rounded-2xl w-16 h-16 flex items-center justify-center text-4xl">
                <span role="img" aria-label="candado">
                  🗺️
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-8xl">
                <span role="img" aria-label="candado">
                  🧠
                </span>
              </div>
            </div>
          </div>

          {/* Videos Card */}
          <div
            onClick={openVideoModal}
            className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition transform"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Videos</h3>
                <h4 className="text-3xl font-bold text-white">Recomendados</h4>
              </div>
              <div className="bg-yellow-300 rounded-2xl w-16 h-16 flex items-center justify-center text-4xl">
                <span role="img" aria-label="candado">
                  🌐
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <div className="text-8xl">
                <span role="img" aria-label="candado">
                  🎬
                </span>
              </div>
            </div>
          </div>

          {/* Plan Anual Card */}
          <div
            onClick={() => setShowPlanModal(true)}
            className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition transform md:col-span-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Plan Anual
                </h3>
                <h4 className="text-3xl font-bold text-white">Tecnología</h4>
              </div>
              <div className="bg-yellow-300 rounded-2xl w-16 h-16 flex items-center justify-center text-4xl">
                <span role="img" aria-label="candado">
                  📋
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-8xl">
                <span role="img" aria-label="candado">
                  📚
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Concept Map Modal */}
        {showConceptMapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl relative">
              <button
                onClick={closeConceptMapModal}
                className="absolute top-4 right-4 z-10 bg-red-500 rounded-full p-3 hover:bg-red-600 transition shadow-lg"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 border-b-4 border-purple-600">
                <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
                  <span className="text-5xl">
                    <span role="img" aria-label="candado">
                      🗺️
                    </span>
                  </span>
                  Mapa Conceptual: {inputText}
                  <span className="text-5xl">
                    <span role="img" aria-label="candado">
                      🧠
                    </span>
                  </span>
                </h2>
                {isLoadingConcepts && (
                  <p className="text-white text-center mt-2 text-lg font-semibold">
                    ¡Generando tu mapa conceptual!{' '}
                    <span role="img" aria-label="candado">
                      🚀
                    </span>
                  </p>
                )}
              </div>

              <div className="h-[calc(90vh-120px)]">
                {isLoadingConcepts ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin text-8xl mb-4">
                      <span role="img" aria-label="candado">
                        🌀
                      </span>
                    </div>
                    <p className="text-gray-700 text-2xl font-bold">
                      Creando conexiones...
                    </p>
                  </div>
                ) : nodes.length > 0 ? (
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    attributionPosition="bottom-left"
                  >
                    <Controls />
                    <MiniMap
                      nodeColor={(node) => {
                        if (node.id === 'main') return '#667eea';
                        return '#f093fb';
                      }}
                      maskColor="rgba(0, 0, 0, 0.1)"
                    />
                    {/*<Background variant="dots" gap={12} size={1} />*/}
                    <Background
                      variant={BackgroundVariant.Dots}
                      gap={12}
                      size={1}
                    />
                  </ReactFlow>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-700 text-2xl font-bold text-center">
                      No se pudo generar el mapa conceptual
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative">
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 hover:bg-gray-100 transition shadow-lg"
              >
                <X size={24} className="text-gray-700" />
              </button>

              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-6 border-b-4 border-white border-opacity-30">
                <h2 className="text-4xl font-bold text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
                  <span className="text-5xl">
                    <span role="img" aria-label="candado">
                      🎬
                    </span>
                  </span>
                  Videos para ti
                  <span className="text-5xl">
                    <span role="img" aria-label="candado">
                      🍿
                    </span>
                  </span>
                </h2>
                <p className="text-white text-center mt-2 text-lg font-semibold">
                  {loading
                    ? '¡Buscando videos increíbles! 🔍'
                    : `Sobre: "${inputText}"`}
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin text-8xl mb-4">
                      <span role="img" aria-label="candado">
                        🎬
                      </span>
                    </div>
                    <p className="text-white text-2xl font-bold">
                      Cargando videos...
                    </p>
                  </div>
                ) : videos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {videos.map((video, index) => (
                      <div
                        key={video.id.videoId}
                        className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02]"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative pb-[56.25%] md:pb-0 md:h-64">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full md:relative md:h-64"
                              src={`https://www.youtube.com/embed/${video.id.videoId}`}
                              title={video.snippet.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                          <div className="p-4 flex flex-col justify-center">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-3xl">
                                {['🌟', '🎯', '🚀', '💡', '🎨'][index]}
                              </span>
                              <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                                {video.snippet.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                              {video.snippet.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full font-semibold">
                                {video.snippet.channelTitle}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-white text-2xl font-bold text-center">
                      ¡Ups! Escribe algo en el cuadro de búsqueda primero
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plan Anual Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50 p-4 animate-fade-in pt-20">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">
              {/* Header del modal */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span role="img" aria-label="candado">
                    📚
                  </span>
                  Plan Anual de Tecnología
                </h2>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Contenido scrolleable */}
              <div className="overflow-y-auto flex-1">
                <PlanTecnologia
                  onSelectTema={(tema) => {
                    setInputText(tema); // escribe en la cajita
                    setShowPlanModal(false); // cierra el modal
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Progress Section 
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-gray-700">
                Explorador nivel 3
              </h3>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition">
              <MessageSquare size={24} />
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
              style={{ width: '60%' }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 font-semibold">
                Curioso del mes
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Star fill="orange" stroke="orange" size={28} />
              </div>
            </div>
            <div className="text-sm text-gray-600 font-semibold">
              Informático
            </div>
          </div>
        </div>
        */}
      </div>

      <style>
        {`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}
      </style>
    </div>
  );
}
