import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userdb = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState("");

    const fetchMovies = async () => {
        try {
            const endpoint = query
                ? `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
                : `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`;

            const res = await axios.get(endpoint);
            setMovies(res.data.results);
            console.log(res, "get response");

        } catch (err) {
            console.error("Error fetching movies:", err);
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setPage(1);
            fetchMovies();
        }
    };

    const openTrailerModal = async (movie) => {
        try {
            const res = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
            );
            const trailers = res.data.results.filter(
                (video) => video.type === "Trailer" && video.site === "YouTube"
            );
            if (trailers.length > 0) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
                setSelectedMovie(movie);
            } else {
                alert("Trailer not available.");
            }
        } catch (error) {
            console.error("Failed to fetch trailer:", error);
            alert("Error fetching trailer.");
        }
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setTrailerUrl("");
    };

    useEffect(() => {
        fetchMovies();
    }, [page]);

    return (
        <div className="container py-4">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleSearch}
                />
                
            </div>

            {/* Movie Grid */}
            <div className="row row-cols-2 row-cols-md-4 g-2">
                {movies.map((movie) => (
                    <div key={movie.id} className="col">
                        <div className="card bg-dark text-white h-100">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                className="card-img-top"
                                alt={movie.title}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{movie.title}</h5>
                               
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={() => openTrailerModal(movie)}
                                >
                                    Watch Trailer
                                </button>
                                <Link
                                    to={`/movie/${movie.id}`}
                                    className="btn btn-outline-light mt-2"
                                >
                                    Show Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {/* Modal */}
            {selectedMovie && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    onClick={closeModal}
                    style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                >
                    <div
                        className="modal-dialog modal-lg modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedMovie.title} Trailer</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        src={trailerUrl}
                                        title="Trailer"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Userdb;
