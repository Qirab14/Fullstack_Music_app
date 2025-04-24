import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAlbumDetails } from '../services/api'; // Change to fetchAlbumDetails

export default function AlbumDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const loadAlbum = async () => {
      const data = await fetchAlbumDetails(id); // Change to fetchAlbumDetails
      setAlbum(data);
    };
    loadAlbum();
  }, [id]);

  if (!album) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <img src={album.cover_url} alt={album.title} className="w-40 h-40 object-cover rounded mb-4" />
      <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
      <p className="text-gray-400 mb-4">By {album.artist.name}</p>
    </div>
  );
}
