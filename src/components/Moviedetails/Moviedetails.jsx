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
    // console.log(import.meta.env.VITE_TMDB_API_KEY, "APikey"); // Should NOT be undefined

    if (!movie) return <div className="p-5 min-vh-100 d-flex justify-content-center align-items-center bg-dark text-white position-fixed top-0 start-0 w-100 vh-100 z-3">
        <div className="text-center">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading...</p>
        </div>
    </div>;

    return (
        <div
            className="container-fluid text-white min-vh-100 py-4"
            style={{
                background: "linear-gradient(to right, #4c575d, #6e6651)" // You can change the colors
            }}
        >

            <button className="btn btn mb-3 text-white d-flex align-item-center" style={{ backgroundColor: "#6e6651" }} onClick={() => navigate(-1)}>
                <i class="ri-arrow-left-line"></i> Back
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
                <div className="col-12 col-md-9 bg-dark text-white rounded p-4 mt-2 mt-sm-0">
                    <p><strong>Title: </strong> {movie.title}</p>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
                    <p><strong>Runtime:</strong> {movie.runtime} mins</p>
                    <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
                    <hr />
                    <div className="">
                        <strong className="fs-5">Overview</strong>
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MovieDetail;
