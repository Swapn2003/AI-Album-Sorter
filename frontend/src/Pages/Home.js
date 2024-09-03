import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import back from '../Assets/back.jpg';
import Navbar from '../Components/Navbar';

const Home = () => {
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);

  const authToken = localStorage.getItem('token');
  console.log(authToken);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAlbums();
  }, []);

  const fetchAllAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/albums`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // Ensure authToken is available in your component
        },
      });

      if (response.status === 200) { // Assuming 200 OK status for a successful response
        const albums = response.data.map(album => ({ ids: album._id, name: album.album_name }));
        console.log(setAlbums);
        setAlbums(albums);
        setLoading(false);
      } else {
        console.error('Unexpected response:', response.statusText);
        setLoading(false);
        //setError('An error occurred while fetching albums');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setLoading(false);
      //setError('An error occurred while fetching albums');
    }

  };


  const handleAlbumClick = (albumId, album_name) => {
    navigate(`/albums/${albumId}`, { state: { album_name } });
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    if (newAlbumTitle && newPassword) {
      const newAlbum = {
        album_name: newAlbumTitle,
        password: newPassword,
      };

      try {

        const response = await axios.post(`/api/albums`, newAlbum, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.status === 201) {
        } else {
          console.error('Unexpected response:', response.statusText);
        }
        setNewAlbumTitle('');
        setNewPassword('');
        setShowCreatePopup(false);
        document.getElementById('album-section').scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error creating album:', error);
      }
    }
    fetchAllAlbums();
  };

  const handleImportAlbum = async (e) => {
    e.preventDefault();

    if (newAlbumTitle && newPassword) {
      const newAlbum = {
        album_id: newAlbumTitle,
        password: newPassword,
      };

      try {
        const response = await axios.post(`/api/albums/${newAlbumTitle}/add`, newAlbum, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.status === 201) {
        } else {
          console.error('Unexpected response:', response.statusText);
        }
        setNewAlbumTitle('');
        setNewPassword('');
        setShowImportPopup(false);
        document.getElementById('album-section').scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error importing album:', error);
      }
    }
    fetchAllAlbums();
  };



  return (
    <div className="all-album-view">
      <Navbar />
      <div className="allalbum-image-container">
        <div className="allalbum-content">Framed Memories</div>
        <div className="button-container">
          <button onClick={() => setShowCreatePopup(true)} className="popup-button">
            Create Album
          </button>
          <button onClick={() => setShowImportPopup(true)} className="popup-button">
            Import Album
          </button>
        </div>
      </div>

      {showCreatePopup && (
        <div className="popup">
          <button onClick={() => setShowCreatePopup(false)} className="close-button">&times;</button>
          <form onSubmit={handleCreateAlbum} className="popup-form">
            <input
              type="text"
              placeholder="Enter Album Title"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input"
            />
            <div className="submit-btn"><button type="submit" className="submit-button">Create</button></div>
          </form>
        </div>
      )}

      {showImportPopup && (
        <div className="popup">
          <button onClick={() => setShowImportPopup(false)} className="close-button">&times;</button>
          <form onSubmit={handleImportAlbum} className="popup-form">
            <input
              type="text"
              placeholder="Enter Album ID"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input"
            />
            <div className="submit-btn"><button type="submit" className="submit-button">Import</button></div>
          </form>
        </div>
      )}

      <div id="album-section" className="albums-container">
        <div className="album-section-title">My Albums</div>
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          alert(error) // Use alert for errors
        ) : (
          <div className="album-grid">
            {albums.map((album) => (
              <div
                key={album.ids}
                className="album-card"
                onClick={() => handleAlbumClick(album.ids, album.name)}
              >
                <p>{album.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        Powered by Photon
      </footer>
    </div>
  );
};

export default Home;