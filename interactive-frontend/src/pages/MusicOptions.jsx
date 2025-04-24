// src/pages/MusicOptions.js

import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/music-bg.jpg'; // make sure this image exists in /assets

const options = [
  { label: 'Artists', route: '/artists' },
  { label: 'Albums', route: '/albums' },
  { label: 'Tracks', route: '/tracks' },
];

export default function MusicOptions() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-lg shadow-xl text-white space-y-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold">Explore Music</h1>

        {options.map((option, index) => (
          <button
            key={option.label}
            onClick={() => navigate(option.route)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold transition-all duration-200"
            style={{
              opacity: index % 2 === 0 ? 0.8 : 1, // Simple fade-in effect based on index
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
