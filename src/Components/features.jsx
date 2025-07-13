export function processPodcasts(
  data,
  { searchTerm, sortOrder, currentPage, itemsPerPage }
) {
  let filterItems = data;

  if (searchTerm) {
    filterItems = filterItems.filter((filt) =>
      filt.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
