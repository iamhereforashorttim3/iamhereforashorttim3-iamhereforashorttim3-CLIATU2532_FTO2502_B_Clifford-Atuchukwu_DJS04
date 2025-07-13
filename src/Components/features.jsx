import { genres } from "./data";

/**
 * It process the array of podcast data by using search, filtering, sorting and pagination.
 *
 * @param {Array<object>} data - The list of podcast objects that need to be processed
 * @param {object} options - configuration for the filtering, sorting and pagination
 *
 * @returns {{paginatedData, totalPages}}
 * - paginatedData: The array of podcasts for the current page.
 * - totalPages - total number of pages available after filtering.
 */
export function processPodcasts(
  data,
  { searchTerm, sortOrder, genreFilter, currentPage, itemsPerPage }
) {
  let filterItems = data;

  if (searchTerm) {
    filterItems = filterItems.filter((filt) =>
      filt.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (genreFilter) {
    filterItems = filterItems.filter((filt) => {
      const genreNames = filt.genres.map(
        (id) => genres.find((genre) => genre.id === id)?.title
      );
      return genreNames.includes(genreFilter);
    });
  }

  if (sortOrder === "az") {
    filterItems.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === "za") {
    filterItems.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOrder === "new") {
    filterItems.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  } else if (sortOrder === "old") {
    filterItems.sort((a, b) => new Date(a.updated) - new Date(b.updated));
  }

  const totalPages = Math.ceil(filterItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filterItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return { paginatedData, totalPages };
}
