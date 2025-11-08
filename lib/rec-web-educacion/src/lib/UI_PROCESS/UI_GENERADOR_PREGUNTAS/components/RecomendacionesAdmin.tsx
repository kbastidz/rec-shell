import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Star, X } from 'lucide-react';

import 'reactflow/dist/style.css';
import { useGemini } from '@rec-shell/rec-web-shared';
import ReactFlow, { Background, Controls, MarkerType, MiniMap, Position, useEdgesState, useNodesState } from 'reactflow';



// Función para parsear la respuesta del modelo
const handleModelResponse = ({ text, onParsed, onError, onFinally }) => {
  try {
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanText);
    onParsed(parsed);
  } catch (err) {
    console.error('Error parseando respuesta:', err);
    onError(err);
  } finally {
    if (onFinally) onFinally();
  }
};

// Componente principal
export  function RecomendacionesAdmin() {
  const [inputText, setInputText] = useState('fracciones');
  const [showResponse, setShowResponse] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showConceptMapModal, setShowConceptMapModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [generatedConcepts, setGeneratedConcepts] = useState(null);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setShowResponse(true);
      await fetchYoutubeVideos(inputText);
    }
  };

  const fetchYoutubeVideos = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=AIzaSyA3m56gu6RJJ9etf1HRiP3m9LK2XmIVjxA`
      );
      const data = await response.json();
      if (data.items) {
        setVideos(data.items);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const { loading: loadingGemini, error: errorGemini, generateText } = useGemini({
    onSuccess: (text) =>
      handleModelResponse({
        text,
        onParsed: (data) => {
          console.log('data', data);
          setGeneratedConcepts(data);
          convertToReactFlowElements(data);
          setIsLoadingConcepts(false);
        },
        onError: (err) => {
          console.error('Error procesando conceptos:', err);
          setIsLoadingConcepts(false);
        },
        onFinally: () => {
          console.log('✨ Finalizó el procesamiento del mapa conceptual');
        },
      }),
    onError: (err) => {
      console.error('Error en Gemini:', err);

      const mockResponse ={
    "mainTopic": "Historia del Uso de Internet",
    "concepts": [
        {
            "name": "Orígenes de ARPANET (1960s-1970s)",
            "description": "Red experimental del Departamento de Defensa de EE. UU. para la comunicación e intercambio de recursos entre computadoras académicas y militares, sentando las bases de la conmutación de paquetes.",
            "relatedTo": [
                1,
                3
            ]
        },
        {
            "name": "Nacimiento de la World Wide Web (1989-1990s)",
            "description": "Tim Berners-Lee propone un sistema de gestión de información basado en hipertexto. Se desarrollan HTTP, HTML y el primer navegador/editor web, democratizando el acceso a la información.",
            "relatedTo": [
                0,
                2,
                3
            ]
        },
        {
            "name": "Primeros Navegadores Gráficos (1993-1990s)",
            "description": "La aparición de navegadores como Mosaic y Netscape Navigator facilitó enormemente la navegación web con interfaces gráficas, impulsando la adopción masiva de internet por el público general.",
            "relatedTo": [
                1,
                3
            ]
        },
        {
            "name": "Comercialización e Internet para el Consumidor (1990s-2000s)",
            "description": "Se levantan las restricciones al uso comercial de internet, surgen los Proveedores de Servicios de Internet (ISP) y el boom de las 'puntocom', llevando internet a los hogares y empresas.",
            "relatedTo": [
                0,
                1,
                2,
                4
            ]
        },
        {
            "name": "Web 2.0 y Redes Sociales (2000s)",
            "description": "Transición hacia una web más interactiva y participativa, donde los usuarios generan contenido. Surgen plataformas como Wikipedia, YouTube, Facebook y Twitter, transformando la comunicación.",
            "relatedTo": [
                3,
                5,
                6
            ]
        },
        {
            "name": "Internet Móvil y Ubicuo (2007-Actualidad)",
            "description": "La proliferación de smartphones y tabletas hace que internet sea accesible en cualquier momento y lugar, impulsando el desarrollo de aplicaciones móviles y servicios basados en la ubicación.",
            "relatedTo": [
                4,
                6,
                7
            ]
        },
        {
            "name": "Impacto Global y Transformación Social (Actualidad)",
            "description": "El internet ha redefinido la educación, el comercio, la política y las relaciones sociales a escala global, creando una sociedad interconectada y dependiente de la información digital.",
            "relatedTo": [
                4,
                5,
                7
            ]
        },
        {
            "name": "Desafíos Actuales (Actualidad)",
            "description": "El uso masivo de internet plantea retos como la privacidad de datos, la ciberseguridad, la desinformación (fake news), la brecha digital y el impacto en la salud mental.",
            "relatedTo": [
                5,
                6
            ]
        }
    ]
    };
      setGeneratedConcepts(mockResponse);
      convertToReactFlowElements(mockResponse);

      setIsLoadingConcepts(false);
    },
  });

    const convertToReactFlowElements = (data) => {
    if (!data || !data.concepts) return;

    const newNodes = [];
    const newEdges = [];

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
          textAlign: 'center',
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
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{concept.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{concept.description}</div>
            </div>
          )
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

    const promptTemplate = `Genera un mapa conceptual educativo sobre el tema: "${inputText}".

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones) con esta estructura exacta:

{
  "mainTopic": "Tema principal",
  "concepts": [
    {
      "name": "Concepto 1",
      "description": "Descripción breve",
      "relatedTo": [1, 2]
    },
    {
      "name": "Concepto 2",
      "description": "Descripción breve",
      "relatedTo": []
    }
  ]
}

Genera entre 6 y 9 conceptos clave relacionados con el tema. El campo "relatedTo" debe contener índices (números) de otros conceptos relacionados en el array "concepts".`;

    await generateText(promptTemplate);
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            ¡Hola, Kevin! 👋
          </h1>
          <p className="text-2xl md:text-3xl text-white font-semibold drop-shadow">
            ¿Qué te gustaría aprender hoy?
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
              ✋
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div>
            <label className="block text-gray-500 text-sm mb-2">
              Escribe o di algo como:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="quiero aprender sobre fracciones"
                className="flex-1 text-xl text-gray-700 outline-none"
              />
              <button onClick={handleSubmit} className="p-3 hover:bg-gray-100 rounded-full transition">
                🎤
              </button>
            </div>
          </div>
        </div>

        {/* Response Card */}
        {showResponse && (
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 animate-fade-in">
            <p className="text-xl text-gray-700">
              <span className="font-bold">¡Genial!</span> Encontré un mapa conceptual 🗺️ y videos para ti 📹
            </p>
          </div>
        )}

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
                🗺️
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-8xl">🧠</div>
            </div>
          </div>

          {/* Videos Card */}
          <div 
            onClick={openVideoModal}
            className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition transform"
          >
            <h3 className="text-3xl font-bold text-white mb-2">Videos</h3>
            <h4 className="text-3xl font-bold text-white mb-8">recomendados</h4>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-7xl">🦕</div>
              <div className="text-6xl">▲</div>
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
                  <span className="text-5xl">🗺️</span>
                  Mapa Conceptual: {inputText}
                  <span className="text-5xl">🧠</span>
                </h2>
                {isLoadingConcepts && (
                  <p className="text-white text-center mt-2 text-lg font-semibold">
                    ¡Generando tu mapa conceptual! 🚀
                  </p>
                )}
              </div>

              <div className="h-[calc(90vh-120px)]">
                {isLoadingConcepts ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin text-8xl mb-4">🌀</div>
                    <p className="text-gray-700 text-2xl font-bold">Creando conexiones...</p>
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
                    <Background variant="dots" gap={12} size={1} />
                  </ReactFlow>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-8xl mb-4">😕</div>
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
                  <span className="text-5xl">🎬</span>
                  Videos para ti, Kevin
                  <span className="text-5xl">🍿</span>
                </h2>
                <p className="text-white text-center mt-2 text-lg font-semibold">
                  {loading ? '¡Buscando videos increíbles! 🔍' : `Sobre: "${inputText}"`}
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin text-8xl mb-4">🎪</div>
                    <p className="text-white text-2xl font-bold">Cargando videos...</p>
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
                              <span className="text-3xl">{['🌟', '🎯', '🚀', '💡', '🎨'][index]}</span>
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
                    <div className="text-8xl mb-4">😕</div>
                    <p className="text-white text-2xl font-bold text-center">
                      ¡Ups! Escribe algo en el cuadro de búsqueda primero
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-gray-700">Explorador nivel 3</h3>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition">
              <MessageSquare size={24} />
            </button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 font-semibold">Curioso del mes</div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Star fill="orange" stroke="orange" size={28} />
              </div>
            </div>
            <div className="text-sm text-gray-600 font-semibold">Matemático</div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}