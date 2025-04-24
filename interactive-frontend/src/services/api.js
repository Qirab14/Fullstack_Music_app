const BASE_URL = 'http://localhost:3000/api'; // Or your backend URL

// Fetch all artists
export const fetchArtists = async () => {
  const res = await fetch(`${BASE_URL}/artists`);
  return res.json();
};

// Fetch artist details by ID
export const fetchArtistDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/artists/${id}`);
  return res.json();
};

// Fetch all albums
export const fetchAlbums = async () => {
  const res = await fetch(`${BASE_URL}/albums`);
  return res.json();
};

// Fetch album details by ID
export const fetchAlbumDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/albums/${id}`);
  return res.json();
};

// Fetch all tracks
export const fetchTracks = async () => {
  const res = await fetch(`${BASE_URL}/tracks`);
  return res.json();
};

// Fetch track details by ID
export const fetchTrackDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/tracks/${id}`);
  return res.json();
};

export const toggleFavorite = async (id) => {
  const res = await fetch(`${BASE_URL}${id}/favorite`, {
    method: 'PATCH',
  });
  return res.json();
};