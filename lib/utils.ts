

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(price);
}


export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If total pages is 7 or less, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is among the first 3 pages, show first 3, ellipsis, and last 2
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If current page is among the last 3 pages, show first 2, ellipsis, and last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If current page is in the middle, show first, ellipsis, current-1, current, current+1, ellipsis, last
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}

// export function slugConvert(name: string) {
//   return name
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-')         // spaces → hyphens
//     .replace(/[^\w-]+/g, '');     // remove special chars
// }

export function slugConvert(name?: string | null) {
  if (!name) return ""; // return empty if null or undefined

  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         
    .replace(/[^\w-]+/g, '');     
}
