import "react";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 1000, [searchTerm]);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  // const API_KEY =
  // "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjVhMDNhMzAxMDNiYjY1NWRmMGZiNzRjN2ZiNzZlOCIsIm5iZiI6MTczODEyNTE5MC42ODMsInN1YiI6IjY3OTlhZjg2MzA2YjZhMTM1NjI3OWEwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pGtA7fFM5-AjdOdygykUaMOVmheaBQHkJCo9vJHewbY";

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const featchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Error featching movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Error featching movies");
        setMovieList([]);
        return;
      }
      console.log(data);
      setMovieList(data.results);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (e) {
      console.error(`Error featching movies: ${e}`);
      setErrorMessage("Error featching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const trendingMovies = await getTrendingMovies();
      setTrendingMovies(trendingMovies);
      setTrendingMovies(trendingMovies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setErrorMessage(
        "Error fetching trending movies. Please try again later."
      );
    }
  };

  useEffect(() => {
    featchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero-banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You&apos;ll
              Enjoy Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2 className="mt-10">all movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
