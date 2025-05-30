import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';

const MovieInfo = () => {
  const [movieData, setMovieData] = useState(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true); 
  const [existingPlaylists, setExistingPlaylists] = useState([]);
  const { id } = useParams();

  const handleAddToPlaylist = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      console.log(token);
      const response = await fetch(`https://movielister.onrender.com/api/playlist/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });
      if (response.ok) {
        const playlists = await response.json();
        setExistingPlaylists(playlists);
        setShowAddToPlaylistModal(true);
      } else {
        throw new Error('Failed to fetch existing playlists');
      }
    } catch (error) {
      console.error('Error fetching existing playlists:', error);
    }
  };

  const handleAddToExistingPlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('authToken');

      const playlistData = {
        movieId: id
      };

      const response = await fetch(`https://movielister.onrender.com/api/playlist/${playlistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(playlistData)
      });

      if (!response.ok) {
        throw new Error('Failed to add movie to playlist');
      }

      // Movie added to playlist successfully
      setShowAddToPlaylistModal(false);
      console.log('Movie added to playlist successfully!');
    } catch (error) {
      console.error('Error adding movie to playlist:', error);
      // Optionally, display an error message to the user
    }
  };

  const handleOpenCreatePlaylistModal = () => {
    setShowAddToPlaylistModal(false);
    setShowCreatePlaylistModal(true);
  };

  const handleCloseCreatePlaylistModal = () => {
    setShowCreatePlaylistModal(false);
    setShowAddToPlaylistModal(true);
  };

  const handlePlaylistSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const playlistData = {
        userId: userId,
        name: playlistName,
        public: isPublic
      };

      const response = await fetch('https://movielister.onrender.com/api/playlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(playlistData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      // Playlist created successfully
      setShowCreatePlaylistModal(false);
      setShowAddToPlaylistModal(false);
      console.log('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Optionally, display an error message to the user
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const apiKey = '7b41e48a';
        const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found.');
        }

        setMovieData(data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  return (
    <div className="container mt-5">
      {movieData && (
        <div className="row">
          <div className="col-md-4">
            <img src={movieData.Poster} alt={movieData.Title} className="img-fluid rounded" />
          </div>
          <div className="col-md-8">
            <h2>{movieData.Title}</h2>
            <p>
              <strong>Year:</strong> {movieData.Year}<br />
              <strong>Rated:</strong> {movieData.Rated}<br />
              <strong>Released:</strong> {movieData.Released}<br />
              <strong>Runtime:</strong> {movieData.Runtime}<br />
              <strong>Genre:</strong> {movieData.Genre}<br />
              <strong>Director:</strong> {movieData.Director}<br />
              <strong>Writer:</strong> {movieData.Writer}<br />
              <strong>Actors:</strong> {movieData.Actors}<br />
              <strong>Language:</strong> {movieData.Language}<br />
              <strong>Country:</strong> {movieData.Country}<br />
              <strong>Awards:</strong> {movieData.Awards}<br />
              <strong>IMDb Rating:</strong> {movieData.imdbRating} ({movieData.imdbVotes} votes)<br />
            </p>
            <Button variant="primary" onClick={handleAddToPlaylist}>
              Add to Playlist
            </Button>
          </div>
        </div>
      )}

      {/* Modal for selecting existing playlists */}
      <Modal show={showAddToPlaylistModal} onHide={() => setShowAddToPlaylistModal(false)} className='text-black'>
        <Modal.Header closeButton>
          <Modal.Title>Select Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {existingPlaylists.map(playlist => (
            <Button
              key={playlist._id}
              variant="outline-secondary"
              className="mb-2"
              onClick={() => handleAddToExistingPlaylist(playlist._id)}
            >
              {playlist.name}
            </Button>
          ))}
          <Button variant="primary" onClick={handleOpenCreatePlaylistModal}>
            Create New Playlist
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal for creating a new playlist */}
      <Modal show={showCreatePlaylistModal} onHide={() => setShowCreatePlaylistModal(false)} className='text-black'>
        <Modal.Header closeButton>
          <Modal.Title>Create New Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePlaylistSubmit}>
            <Form.Group controlId="playlistName">
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="playlistPrivacy">
              <Form.Check
                type="radio"
                label="Public"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <Form.Check
                type="radio"
                label="Private"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieInfo;





