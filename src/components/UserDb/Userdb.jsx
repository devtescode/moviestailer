import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userdb = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchMovies = async () => {
        setLoading(true); // start loading
        try {
            const endpoint = query
                ? `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
                : `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`;

            const res = await axios.get(endpoint);
            setMovies(res.data.results);
        } catch (err) {
            console.error("Error fetching movies:", err);
        } finally {
            setLoading(false); // stop loading
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
        // <div className="container-fluid bg-dark text-white min-vh-100 py-4">
            <div
            className="container-fluid text-white min-vh-100 py-4"
            style={{
                background: "linear-gradient(to right, #4c575d, #6e6651)" // You can change the colors
            }}
        >
            <div className="d-flex justify-content-center mb-4">
                <div className="input-group" style={{ maxWidth: "500px" }}>
                    <input
                        type="text"
                        className="form-control  border-secondary"
                        placeholder="Search movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleSearch}
                    />
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={fetchMovies}
                    >
                        <i className="fas fa-search me-1"></i>Search
                    </button>
                </div>
            </div>



            {/* Movie Grid */}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center bg-dark text-white position-fixed top-0 start-0 w-100 vh-100 z-3">
                    <div className="text-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading...</p>
                    </div>
                </div>


            ) : (
                <div className="row row-cols-2 row-cols-md-4 g-2">
                    {movies.map((movie) => (
                        <div key={movie.id} className="col">
                            <div className="card bg-black text-white h-100 shadow-sm border border-secondary">
                                <div className="position-relative overflow-hidden">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        className="card-img-top object-fit-cover"
                                        style={{ height: "250px", objectFit: "cover" }}
                                        alt={movie.title}
                                    />
                                    <div className="overlay d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition">
                                        <button
                                            className="btn btn-light rounded-circle"
                                            onClick={() => openTrailerModal(movie)}
                                        >
                                            <i className="fas fa-play text-dark"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title text-truncate">{movie.title}</h5>
                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-outline-light btn-sm w-100 mb-2"
                                            onClick={() => openTrailerModal(movie)}
                                        >
                                            <i className="fas fa-film me-1"></i> Watch Trailer
                                        </button>
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="btn btn-outline-secondary btn-sm w-100"
                                        >
                                            <i className="fas fa-info-circle me-1"></i> Show Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-5 px-3">
                <button
                    className="btn btn-outline-light"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >
                    <i className="fas fa-chevron-left me-1"></i> Previous
                </button>
                <span className="fs-5">Page {page}</span>
                <button
                    className="btn btn-outline-light"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next <i className="fas fa-chevron-right ms-1"></i>
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
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">{selectedMovie.title} Trailer</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
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





