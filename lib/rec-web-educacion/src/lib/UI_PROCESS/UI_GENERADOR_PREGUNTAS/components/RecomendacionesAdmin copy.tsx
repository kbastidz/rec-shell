import React, { useState } from 'react';
import { MessageSquare, Star, X } from 'lucide-react';

export  function RecomendacionesAdmin() {
  const [inputText, setInputText] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
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
              {/* Robot Face */}
              <div className="relative">
                {/* Antenna */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-cyan-400"></div>
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-300 rounded-full"></div>
                
                {/* Head */}
                <div className="w-40 h-32 bg-cyan-200 rounded-3xl border-4 border-cyan-400 flex items-center justify-center relative">
                  {/* Eyes */}
                  <div className="flex gap-8">
                    <div className="w-8 h-10 bg-blue-900 rounded-full relative">
                      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="w-8 h-10 bg-blue-900 rounded-full relative">
                      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {/* Smile */}
                  <div className="absolute bottom-4 w-16 h-8 border-b-4 border-blue-900 rounded-b-full"></div>
                </div>
                
                {/* Ears */}
                <div className="absolute top-8 -left-12 w-10 h-10 bg-blue-500 rounded-full"></div>
                <div className="absolute top-8 -right-12 w-10 h-10 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Waving Hand */}
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
                placeholder="quiero jugar con fracciones"
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
              <span className="font-bold">¡Genial!</span> Encontré algunos juegos sobre fracciones 🍕 y un video para ti 📹
            </p>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Games Card */}
          <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition transform">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Juegos</h3>
                <h4 className="text-3xl font-bold text-white">para aprender</h4>
              </div>
              <div className="bg-yellow-300 rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold text-gray-700">
                <div className="text-center">
                  <div className="text-2xl">1</div>
                  <div className="text-xs">—</div>
                  <div className="text-2xl">2</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-8xl">🐢</div>
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

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 hover:bg-gray-100 transition shadow-lg"
              >
                <X size={24} className="text-gray-700" />
              </button>

              {/* Modal Header */}
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

              {/* Videos Grid */}
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
                          {/* Video Player */}
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
                          
                          {/* Video Info */}
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
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
          </div>

          {/* Badges */}
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