import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtistDetails } from '../services/api'; // Change to fetchArtistDetails

export default function ArtistDetails() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const loadArtist = async () => {
      const data = await fetchArtistDetails(id); // Change to fetchArtistDetails
      setArtist(data);
    };
    loadArtist();
  }, [id]);

  if (!artist) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <img src={artist.image_url} alt={artist.name} className="w-40 h-40 object-cover rounded-full mb-4" />
      <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
      <p className="text-gray-400 mb-4">{artist.track_count} tracks</p>
    </div>
  );
}
