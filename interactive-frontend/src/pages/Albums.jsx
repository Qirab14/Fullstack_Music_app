import { useEffect, useState } from 'react';
import { fetchAlbums, fetchArtists } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [albumsData, artistsData] = await Promise.all([
          fetchAlbums(),
          fetchArtists()
        ]);
        
        setAlbums(albumsData);
        setArtists(artistsData);
        setLoadingArtists(false);
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
    if (!title || !selectedArtist || !releaseYear || !genre) {
      return alert('Please fill in all fields');
    }

    const year = Number(releaseYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      return alert(`Please enter a valid release year (1900-${currentYear})`);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const albumData = {
        title,
        artist: selectedArtist,
        releaseYear: year,
        genre
      };

      const url = editingId 
        ? `http://localhost:3000/api/albums/${editingId}`
        : 'http://localhost:3000/api/albums';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(albumData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      if (editingId) {
        setAlbums(albums.map(a => a._id === editingId ? data : a));
      } else {
        setAlbums([...albums, data]);
      }

      resetForm();
    } catch (err) {
      console.error('Error:', err);
      alert(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete album
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/albums/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');

      setAlbums(albums.filter(a => a._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Delete failed');
    }
  };

  // Edit album
  const handleEdit = (album) => {
    setEditingId(album._id);
    setTitle(album.title);
    setSelectedArtist(album.artist._id);
    setReleaseYear(album.releaseYear.toString());
    setGenre(album.genre);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSelectedArtist('');
    setReleaseYear('');
    setGenre('');
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">💿 Album Manager</h1>

      {/* Album Form */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl mx-auto mb-12 space-y-4">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId ? 'Edit Album' : 'Add New Album'}
        </h2>
        
        <input
          type="text"
          placeholder="Album Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          required
        />

        <div className="relative">
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white appearance-none"
            disabled={loadingArtists}
            required
          >
            <option value="">Select Artist</option>
            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>
                {artist.name}
              </option>
            ))}
          </select>
          {loadingArtists && (
            <span className="absolute right-3 top-3 text-gray-400">Loading artists...</span>
          )}
        </div>

        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          min="1900"
          max={new Date().getFullYear()}
          required
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          required
        />

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
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded font-semibold bg-gray-600 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">No albums found.</p>
        ) : (
          albums.map((album) => (
            <div
              key={album._id}
              className="bg-gray-800 p-5 rounded-lg transition relative hover:bg-gray-700"
            >
              <div className="cursor-pointer" onClick={() => navigate(`/album/${album._id}`)}>
                <h3 className="text-lg font-semibold">{album.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {artists.find(a => a._id === album.artist)?.name || 'Unknown Artist'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {album.releaseYear} • {album.genre}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(album)}
                  className="text-sm px-3 py-1 rounded-full bg-yellow-500 hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(album._id)}
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