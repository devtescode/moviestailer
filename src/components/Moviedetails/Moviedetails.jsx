import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
                );
                setMovie(res.data);
                console.log(res, "get movies response");

            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetail();
    }, [id]);

    if (!movie) return <div className="text-center p-5">Loading...</div>;

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 py-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="row py-4 bg-white col-md-9 px-3 mx-auto">
                {/* Poster - full width on small, 3 columns on md+ */}
                <div className="col-12 col-md-3 d-flex justify-content-center">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="img-fluid rounded shadow"
                        alt={movie.title}
                        style={{ maxHeight: "450px", objectFit: "cover" }}
                    />
                </div>

                {/* Details - full width on small, 9 columns on md+ */}
                <div className="col-12 col-md-9 bg-dark text-white rounded p-4">
                    <h2 className="fw-bold text-center text-md-start">{movie.title}</h2>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
                    <p><strong>Runtime:</strong> {movie.runtime} mins</p>
                    <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
                    <hr />
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>

    );
};

export default MovieDetail;
