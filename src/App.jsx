import "./App.css";
import { useState, useEffect } from "react";
import { genres } from "./Components/data.js";
import PodcastPreviews from "./Components/podcastPreview.jsx";
import { formatDistanceToNow } from "date-fns";
/**
 *
 * @returns {Jsx Element} It returns the loading indicator, error messages, and the list of the podcast previews
 */
function App() {
  const [podcastData, setPodcastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {loading && <p className="status">Loading podcasts...</p>}

      {error && <p className="status error">Error: {error}</p>}

      {!loading && !error && podcastData.length === 0 && (
        <p className="status empty">No podcasts available.</p>
      )}

      {!loading && !error && podcastData.length > 0 && (
        <div className="podcast-grid">
          {podcastData.map((podcast) => (
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
    </div>
  );
}

export default App;
