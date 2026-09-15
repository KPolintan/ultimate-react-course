import { useEffect, useRef, useState } from "react";

const KEY = 'c1de7d41';

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // callback?.();

        const controller = new AbortController();
        
        const fetchMovies = async () => {
        try {
            setIsLoading(true);
            setError('');

            const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, 
            { signal: controller.signal }
            );

            if (!res.ok) throw new Error("Something went wrong with fetching movies");
            
            const data = await res.json();
            if (data.Response === 'False') throw new Error('Movie not found');

            // setMovies(tempMovieData);
            setMovies(data.Search);
            console.log(data);
            setError('');
            console.log(data.Search);
            // console.log(movies);

            // setIsLoading(false);
        } catch (err) {
            console.error(err.message);

            if (err.name !== 'AbortError') {
            setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
        };

        if(query.length < 2) {
        setMovies([]);
        setError('');
        return;
        };

        // handleCloseMovie();
        fetchMovies();

        return () => {
        controller.abort();
        };
    }, [query])

    return {movies, isLoading, error};
}