import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const KEY = 'c1de7d41';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const {movies, isLoading, error} = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = JSON.parse(localStorage.getItem('watched'));
  //   return storedValue;
  // });

  const handleSelectMovie = (id) => {
    setSelectedID(selectedID => id === selectedID ? null : id);
  }
  
  function handleCloseMovie() {
    setSelectedID(null);
  }

  const handleAddWatched = (movie) => {
    setWatched( watched => [...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }
  
  const handleDeleteWatched = id => {
    setWatched(watched => watched.filter( movie => movie.imdbID !== id));
  }
  
  // useEffect (() => {
  //   localStorage.setItem('watched', JSON.stringify(watched));
  // }, [watched]);
  


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box element={
          <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList watched={watched} /> 
          </>
        } /> */}
        <Box>
          {/* {isLoading? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          { selectedID ? (
            <MovieDetails 
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie} 
              onAddWatched={handleAddWatched}
              watched={watched}
            />) :
            (<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched} 
              />
            </>)
          }
        </Box>
      </Main>
      
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Loader = () => {
  return <p className='loader'>Loading...</p>
}

const ErrorMessage = (({message}) => {
  return <p className='error'><span>⛔</span> {message}</p>
})

const NavBar = ({ children }) => {

  return (
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
  );
}

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect (() => {

    const callback = e => { 

      if (document.activeElement === inputEl.current) return;

      if (e.code === 'Enter') {
        inputEl.current.focus(); 
        setQuery('');
      }
    }

    document.addEventListener('keydown', callback);
    return () => document.addEventListener('keydown', callback);

  }, [setQuery])

  // useEffect(() => {
  //   const el = document.querySelector('.search');
  //   console.log(el);
  //   el.focus();
  // }, [])


  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

const Main = ({ children }) => {

  return (
    <main className="main">
      {children}
    </main>
  );
}

const Box = ({ children }) => {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}
const MovieList = ({ movies, onSelectMovie }) => {

  return (
    <ul className="list list-movies">
          {movies?.map((movie) => (
            <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
          ))}
    </ul>
  )
}
const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// const WatchedBox = () => {
//   const [watched, setWatched] = useState(tempWatchedData);
  
//   const [isOpen2, setIsOpen2] = useState(true);


//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
const MovieDetails = (({ selectedID, onCloseMovie, onAddWatched, watched }) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current++;
  },[userRating])

  const isWatched = watched.map( movie => movie.imdbID).includes(selectedID);
  // console.log(isWatched);

  const watchedUserRating = watched.find( movie => movie.imdbID === selectedID)?.userRating;

  
  const {
    Title: title, 
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);
  // if (imdbRating > 8) return <p>Awesome score!</p>;

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // useEffect (() => {
    //   setIsTop(imdbRating > 8);
    // }, [imdbRating]);
    
  const isTop = imdbRating > 8;
  console.log(isTop);

  const [avgRating, setAvgRating] = useState(0);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }
    // check watched array for existing ID


    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating(avgRating => (avgRating + userRating)/2);
  }

  useEffect(() => {
    const callback = e => {
      if (e.code === 'Escape') { 
        onCloseMovie(); 
        console.log('closing.');
      }
    }
    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    }
  }, [onCloseMovie]);

  console.log(title, year);

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`);
      
      const data = await res.json();
      setMovie(data);
      console.log(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedID]);

  useEffect(() => {

    if (!title) return;
    document.title = `MOVIE: ${title}`;

    return () => {
      document.title = '🍿 Use Popcorn';
      // console.log(`Clean up effect for movie ${title}`);
    };
  }, [title]);

  return (
    <div className='details'>
      { isLoading ? (
          <Loader />
        ) : (
        <>
          <header>

            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating  
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}

          <section>
            <div className='rating'>
              {!isWatched ? 
                <>
                  <StarRating 
                    maxRating={10}
                    size={24} 
                    onSetRating={setUserRating} 
                    />

                  {userRating > 0 && ( 
                    <button className='btn-add' onClick={handleAdd}>+ Add to List</button>
                  )}
                </>
                :
                <p>Movie already rated {watchedUserRating}<span>⭐</span>.</p>}
            </div>
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );

})

const WatchedSummary = ({ watched }) => {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
const WatchedMoviesList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie 
          movie={movie} 
          key={movie.imdbID} 
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
const WatchedMovie = ({ movie, onDeleteWatched }) => {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className='btn-delete' onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}
