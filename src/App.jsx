import Youtube from 'react-youtube';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = '78316121927f9cbf4e72ff4eaef0e180';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original';
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original';

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: { api_key: API_KEY, query: searchKey },
    });

    setMovies(results);
    setMovie(results[0]);
    if (results.length) await fetchMovie(results[0].id);
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: { api_key: API_KEY, append_to_response: "videos" },
    });

    if (data.videos && data.videos.results.length) {
      const trailer = data.videos.results.find((vid) => vid.name === "Official Trailer");
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <header className="header text-center">
        <h1 className="title">🎥Trailer Movies</h1>
        <h5 className='titleTwo '>Michael Rubiano</h5>
        <form className="search-form" onSubmit={searchMovies}>
          <input
            type="text"
            placeholder="Search for a movie..."
            onChange={(e) => setSearchKey(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </form>
      </header>

      {/* Banner principal */}
      {movie && (
        <section
          className="banner"
          style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}
        >
          <div className="overlay">
            {playing ? (
              <>
                <Youtube
                  videoId={trailer?.key}
                  className="reproductor"
                  containerClassName="youtube-container"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
                <button onClick={() => setPlaying(false)} className="btn-close">✖ Close</button>
              </>
            ) : (
              <div className="movie-info">
                {trailer ? (
                  <button className="btn-play" onClick={() => setPlaying(true)}>
                    ▶ Play Trailer
                  </button>
                ) : (
                  <span className="no-trailer">No trailer available</span>
                )}
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Grid de películas */}
      <div className="container movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => selectMovie(movie)}>
            <img src={`${URL_IMAGE + movie.poster_path}`} alt={movie.title} />
            <div className="movie-details">
              <h4>{movie.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
