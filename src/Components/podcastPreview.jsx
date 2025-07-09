/**
 * This component is meant to display the important details of the podcasts
 * @param {*} param0
 * @returns A card that displays the podcast preview
 */
export default function PodcastPreviews({ podcasts }) {
  return (
    <>
      <div className="podcastPreview">
        <img className="image" src={podcasts.img} />
        <h1 className="title">{podcasts.title}</h1>
        <p className="descriptions">{podcasts.description}</p>
        <p className="seasons">Seasons: {podcasts.seasons}</p>
        <div className="genres">
          {podcasts.genres.map((genres, index) => (
            <span key={index} className="genre-badge">
              {genres}
            </span>
          ))}
        </div>
        <p className="last-updated">{podcasts.updated}</p>
      </div>
    </>
  );
}
