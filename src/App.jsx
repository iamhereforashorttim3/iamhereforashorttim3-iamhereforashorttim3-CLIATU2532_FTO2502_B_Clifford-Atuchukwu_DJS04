import "./App.css";
import { useState, useEffect } from "react";
import { genres } from "./Components/data.js";
import PodcastPreviews from "./Components/podcastPreview.jsx";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { processPodcasts } from "./Components/features.jsx";
/**
 * This component is for displaying and managing the podcasts.
 * It is also for filtering, sorting, search and pagination functionality.
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
  const genre = searchParams.get("genre") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 9;

  /**
   * It fetches the podcast data from an external API and updates the local state.
   *runs once the component mounts

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

  /**
   * @param {string} key - parameter name ("search", "sort", "page")
   * @param {string|number} value - New value to be set
   */
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.set("page", 1);
    setSearchParams(next);
  };

  /**
   * It gets the paginated and filtered data
   */
  const { paginatedData, totalPages } = processPodcasts(podcastData, {
    searchTerm: search,
    sortOrder: sort,
    genreFilter: genre,
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
      <header className="header">
        <h3 class="header-title">ReactCast</h3>

        <div className="search">
          <input
            type="search"
            value={search}
            placeholder="search..."
            onChange={(e) => updateParam("search", e.target.value)}
          />
        </div>
      </header>
      <div className="controls">
        <div className="sort">
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

        <div className="filter">
          <select
            value={genre}
            onChange={(g) => updateParam("genre", g.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.title}>
                {genre.title}
              </option>
            ))}
          </select>
        </div>
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
