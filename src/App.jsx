import "react";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  const featchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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
    } catch (e) {
      console.error(`Error featching movies: ${e}`);
      setErrorMessage("Error featching movies. Please try again later.");
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    featchMovies();
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
          <section className="all-movies">
            <h2>all movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <p key={movie.id} className="text-white">
                    {movie.title}
                  </p>
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
