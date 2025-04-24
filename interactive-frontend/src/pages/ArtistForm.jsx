import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ArtistForm() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/artists', { name, image_url: imageUrl });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Artist</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Artist Name" className="w-full border p-2" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Image URL" className="w-full border p-2" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

