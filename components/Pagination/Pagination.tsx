"use client";

import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | "dots";

const createPaginationItems = (
  currentPage: number,
  totalPages: number,
  mobile = false,
): PaginationItem[] => {
  if (totalPages <= 1) {
    return [1];
  }

  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);

  if (mobile) {
    if (currentPage === 1 && totalPages > 1) {
      pages.add(2);
    }

    if (currentPage === totalPages && totalPages > 1) {
      pages.add(totalPages - 1);
    }
  } else {
    pages.add(currentPage - 1);
    pages.add(currentPage + 1);

    if (currentPage <= 2) {
      pages.add(2);
      pages.add(3);
    }

    if (currentPage >= totalPages - 1) {
      pages.add(totalPages - 1);
      pages.add(totalPages - 2);
    }
  }

  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      result.push("dots");
    }

    result.push(page);
  });

  return result;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderItems = (items: PaginationItem[]) =>
    items.map((item, index) => {
      if (item === "dots") {
        return (
          <span key={`dots-${index}`} className={css.dots}>
            ...
          </span>
        );
      }

      return (
        <button
          key={item}
          type="button"
          className={`${css.pageButton} ${
            currentPage === item ? css.active : ""
          }`}
          onClick={() => onPageChange(item)}
          aria-current={currentPage === item ? "page" : undefined}
        >
          {item}
        </button>
      );
    });

  return (
    <nav aria-label="Pagination">
      <div className={`${css.pagination} ${css.desktopPagination}`}>
        <button
          type="button"
          className={css.arrowButton}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-chevron-left" />
          </svg>
        </button>

        {renderItems(createPaginationItems(currentPage, totalPages))}

        <button
          type="button"
          className={css.arrowButton}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-chevron-left" />
          </svg>
        </button>
      </div>

      <div className={`${css.pagination} ${css.mobilePagination}`}>
        <button
          type="button"
          className={css.arrowButton}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-chevron-right" />
          </svg>
        </button>

        {renderItems(createPaginationItems(currentPage, totalPages, true))}

        <button
          type="button"
          className={css.arrowButton}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
