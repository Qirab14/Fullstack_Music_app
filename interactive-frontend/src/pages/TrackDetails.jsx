import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrackDetails } from '../services/api'; // Change to fetchTrackDetails

export default function TrackDetails() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const loadTrack = async () => {
      const data = await fetchTrackDetails(id); // Change to fetchTrackDetails
      setTrack(data);
    };
    loadTrack();
  }, [id]);

  if (!track) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
      <p className="text-gray-400">{track.artist.name} — {track.album.title}</p>
    </div>
  );
}
