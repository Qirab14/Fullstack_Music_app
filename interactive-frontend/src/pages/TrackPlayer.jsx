import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackDetails } from '../services/api';

export default function TrackPlayer() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadTrack = async () => {
      try {
        const data = await fetchTrackDetails(id);
        setTrack(data);
      } catch (error) {
        console.error('Failed to load track:', error);
      }
    };
    loadTrack();
  }, [id]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return <div className="text-center py-8">Loading track...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-800 rounded-xl p-6">
        <img 
          src={track.album?.coverUrl || ''} 
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg mb-6"
        />
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{track.title}</h1>
          <p className="text-gray-400">
            {track.artist?.name} • {track.album?.title}
          </p>
        </div>

        <div className="mb-4">
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{formatTime((progress / 100) * track.duration)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
            </svg>
          </button>

          <button 
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-4 hover:bg-gray-200"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1zm10 0a1 1 0 00-1 1v10a1 1 0 002 0V5a1 1 0 00-1-1z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            )}
          </button>

          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z"/>
            </svg>
          </button>
        </div>

        <audio
          ref={audioRef}
          src={track.audioUrl}
          onTimeUpdate={(e) => {
            setProgress((e.target.currentTime / e.target.duration) * 100);
          }}
          onEnded={() => setIsPlaying(false)}
          hidden
        />
      </div>
    </div>
  );
}