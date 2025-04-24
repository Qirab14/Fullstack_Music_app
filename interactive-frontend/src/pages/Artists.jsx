import { useEffect, useState } from 'react';
import { fetchArtists, fetchAlbums } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [artistsData, albumsData] = await Promise.all([
          fetchArtists(),
          fetchAlbums()
        ]);
        setArtists(artistsData);
        setAlbums(albumsData);
        setLoadingAlbums(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        alert('Failed to load initial data');
      }
    };
    loadData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !genre) return alert('Please fill in required fields');

    setLoading(true);
    const artistData = {
      name,
      genre,
      albums: selectedAlbums
    };

    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:3000/api/artists/${editingId}`
        : 'http://localhost:3000/api/artists';

      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(artistData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      if (editingId) {
        setArtists(artists.map(a => a._id === editingId ? data : a));
      } else {
        setArtists([...artists, data]);
      }

      resetForm();
    } catch (err) {
      console.error('Error:', err);
      alert(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete artist
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/artists/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');

      setArtists(artists.filter(a => a._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Delete failed');
    }
  };

  // Edit artist
  const handleEdit = (artist) => {
    setEditingId(artist._id);
    setName(artist.name);
    setGenre(artist.genre);
    setSelectedAlbums(artist.albums);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setGenre('');
    setSelectedAlbums([]);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">🎤 Artist Manager</h1>

      {/* Artist Form */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl mx-auto mb-12 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId ? 'Edit Artist' : 'Add New Artist'}
        </h2>
        
        <input
          type="text"
          placeholder="Artist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
        />

        <div className="relative">
          <select
            multiple
            value={selectedAlbums}
            onChange={(e) => setSelectedAlbums([...e.target.selectedOptions].map(o => o.value))}
            className="w-full p-3 rounded bg-gray-800 text-white appearance-none h-32"
            disabled={loadingAlbums}
          >
            {albums.map(album => (
              <option key={album._id} value={album._id}>
                {album.title}
              </option>
            ))}
          </select>
          {loadingAlbums && (
            <span className="absolute right-3 top-3 text-gray-400">Loading albums...</span>
          )}
          <p className="text-sm text-gray-400 mt-1">
            Hold CTRL/CMD to select multiple albums
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-3 rounded font-semibold transition ${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update' : 'Add')}
          </button>
          
          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded font-semibold bg-gray-600 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Artists List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">No artists found.</p>
        ) : (
          artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-gray-800 p-5 rounded-lg transition relative hover:bg-gray-700"
            >
              <div className="cursor-pointer" onClick={() => navigate(`/artist/${artist._id}`)}>
                <h3 className="text-lg font-semibold">{artist.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{artist.genre}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Albums: {artist.albums?.length || 0}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(artist)}
                  className="text-sm px-3 py-1 rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(artist._id)}
                  className="text-sm px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}