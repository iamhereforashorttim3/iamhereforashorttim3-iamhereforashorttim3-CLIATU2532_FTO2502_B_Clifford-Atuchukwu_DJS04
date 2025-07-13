import "./App.css";
import { useState, useEffect } from "react";
import { genres } from "./Components/data.js";
import PodcastPreviews from "./Components/podcastPreview.jsx";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { processPodcasts } from "./Components/features.jsx";
/**
 *
 * @returns {Jsx Element} It returns the loading indicator, error messages, and the list of the podcast previews
 */
function App() {
  const [podcastData, setPodcastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  /**
   * @async
   * @function fetchData
   * @throws new error if the response is not ok
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://podcast-api.netlify.app");

        if (!response.ok) {
          throw new Error("Failed to fetch podcasts");
        }

        const data = await response.json();

        setPodcastData(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setPodcastData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.set("page", 1);
    setSearchParams(next);
  };

  const { paginatedData, totalPages } = processPodcasts(podcastData, {
    searchTerm: search,
    sortOrder: sort,
    currentPage: page,
    itemsPerPage: perPage,
  });

  /**
   * @function getGenres
   * @param {number[]} genreIds - An array of the genre IDs from the podcast data
   * @returns {string[]} An array of genre titles, returns "unknown" if there's no match
   */
  const getGenres = (genreIds) => {
    return genreIds.map((id) => {
      const found = genres.find((genre) => genre.id === id);
      return found ? found.title : "Unknown";
    });
  };

  return (
    <div className="app-container">
      <div className="controls">
        <input
          value={search}
          placeholder="search..."
          onChange={(e) => updateParam("search", e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Sort</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
      </div>
      {loading && <p className="status">Loading podcasts...</p>}

      {error && <p className="status error">Error: {error}</p>}

      {!loading && !error && podcastData.length === 0 && (
        <p className="status empty">No podcasts available.</p>
      )}

      {!loading && !error && podcastData.length > 0 && (
        <div className="podcast-grid">
          {paginatedData.map((podcast) => (
            <PodcastPreviews
              key={podcast.id}
              podcasts={{
                img: podcast.image,
                title: podcast.title,
                description: podcast.description,
                seasons: podcast.seasons,
                genres: getGenres(podcast.genres),
                updated: formatDistanceToNow(new Date(podcast.updated), {
                  addSuffix: true,
                }),
              }}
            />
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="page-numbers">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam("page", i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
