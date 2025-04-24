import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Tracks from './pages/Tracks';
import ArtistDetails from './pages/ArtistDetails';
import AlbumDetails from './pages/AlbumDetails';
import TrackDetails from './pages/TrackDetails';
import Signup from './pages/Signup';
import MusicOptions from './pages/MusicOptions';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/artist/:id" element={<ArtistDetails />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
        <Route path="/track/:id" element={<TrackDetails />} />
        <Route path="/music-options" element={<MusicOptions />} />
      </Routes>
    </Router>
  );
}
