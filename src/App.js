import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";


function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /*useEffect(() => {
      const timer = setInterval(fetchMoviesHandler(), 5000);
      return () => clearInterval(timer);
    }, [error]);*/

  const cancelRetryHandler = () => {
    setError(error.message);
  };

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://helical-land-343114-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const data = await response.json();
     const loadedMovies=[]
     for(const key in data){
      loadedMovies.push({
        id:key,
        title:data[key].title,
        openingText:data[key].openingText,
        releaseDate:data[key].releaseDate
      })
     }
    
      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function addMovieHandler(movie) {
    fetch('https://helical-land-343114-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      }
    })
  }

  let content = <p> Found no movies </p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (isLoading) {
    content = <p> Loading.....</p>;
  }

  if (error) {
    content = (
      <div>
        <p> {error} </p>
        <button onClick={cancelRetryHandler}> Cancel Retry </button>
      </div>
    );
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie= {addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;