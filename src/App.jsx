import React, { useEffect, useState } from "react";
import api from "./api/rawg";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaSteam,
} from "react-icons/fa";
import "./App.css";

const platformIcons = {
  pc: <FaWindows />,
  playstation: <FaPlaystation />,
  xbox: <FaXbox />,
  mac: <FaApple />,
  linux: <FaLinux />,
  steam: <FaSteam />,
};

const App = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("/genres")
      .then((res) => {
        setGenres(res.data.results);
        if (res.data.results.length > 0) {
          setSelectedGenre(res.data.results[0].id);
        }
      })
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const fetchGames = () => {
    api.get("/games", {
      params: {
        genres: searchTerm ? undefined : selectedGenre,
        search: searchTerm || undefined,
        page_size: 8,
      },
    })
      .then((res) => setGames(res.data.results || []))
      .catch((err) => console.error("Error fetching games:", err));
  };

  useEffect(() => {
    if (!selectedGenre || searchTerm) return;
    fetchGames();
  }, [selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGames();
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Genres</h2>
        <ul>
          {genres.map((genre) => (
            <li
              key={genre.id}
              className={selectedGenre === genre.id ? "active" : ""}
              onClick={() => {
                setSelectedGenre(genre.id);
                setSearchTerm("");
              }}
            >
              <img
                src={genre.image_background}
                alt={genre.name}
                className="genre-img"
              />
              <span>{genre.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
<main className="main">
  {/* Search bar above title */}
  <form onSubmit={handleSearch} className="search-form">
    <input
      type="text"
      placeholder="Search games..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button type="submit">Search</button>
  </form>

  <h1>Games</h1>

  {/* Filters */}
  <div className="filters">
    <button className="filter">Platforms ▼</button>
    <button className="filter1">Order by: Relevance ▼</button>
  </div>

  {/* Games list */}
  <div className="games-grid">
    {games.map((game) => (
      <div className="game-card" key={game.id}>
        <img src={game.background_image} alt={game.name} />
        <div className="game-info">
          <div className="platforms">
            {game.parent_platforms?.map((p, i) => (
              <span key={i}>
                {platformIcons[p.platform.slug] || p.platform.name}
              </span>
            ))}
          </div>
          <div className="score">{game.metacritic || "N/A"}</div>
          <h3>{game.name}</h3>
        </div>
      </div>
    ))}
  </div>
</main>

    </div>
  );
};

export default App;




