import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListHeading from './ListHeading';
import SearchBox from './SearchBox';
import ListMovie from './ListMovie';
import home from './home.jpg'
import s1 from './slide1.jpeg'
import s2 from './slide2.jpeg'
import s3 from './slide 3.jpeg'

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [toSearch, setToSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate("/login");
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if(localStorage.getItem('authToken') === undefined){
      navigate("/login");
    }
    const getMovie = async () => {
      const url = `https://www.omdbapi.com/?s=${toSearch}&apikey=4a3b711b`;
      try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        if (jsonResponse.Search) {
          setMovies(jsonResponse.Search);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    if (toSearch.trim() !== '') {
      getMovie();
    }
  }, [toSearch]);

  const styles = {
    welcomeMessage: {
      fontSize: '24px',
      color: '#333',
      padding: '5px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    }
  };




  // carousel
  const images = [
    s1,s2,s3
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className='container-fluid movie d-block'>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <ListHeading heading='Movies' />
        <SearchBox toSearch={toSearch} setToSearch={setToSearch} />
        <div className="col-sm-2">
          <button
            className="btn btn-sm btn-primary w-100 h-40 p-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>{" "}

      </div>
        <div style={styles.welcomeMessage}>
          <h3>Welcome to playlist app...</h3>
          <h4>You can search movies and add them to your playlists...</h4>
        </div>
      {/* Conditional rendering of carousel */}
      {toSearch.trim() === '' && (
        <div className="carousel" style={{ marginLeft: '30%', marginTop: '25px' }}>
          <button onClick={prevImage} className="carousel-button carousel-button-left">{'<'}</button>
          <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carousel-image" height={400} width={600} />
          <button onClick={nextImage} className="carousel-button carousel-button-right">{'>'}</button>
        </div>
      )}

      <div className='row w-100 m-2'>
        <ListMovie movies={movies} />
      </div>
    </div>
  );
};

export default HomePage;
