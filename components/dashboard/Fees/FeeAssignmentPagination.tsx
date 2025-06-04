'use client';

import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface FeeAssignmentPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function FeeAssignmentPagination({
  currentPage,
  totalPages,
}: FeeAssignmentPaginationProps) {
  const [pageIndex, setPageIndex] = useQueryState('pageIndex', {
    defaultValue: '1',
  });

  // Convert pageIndex to number for easier comparison
  const currentPageNum = Number(pageIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPageIndex(String(page));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);

    // Calculate range of pages to show around current page
    let start = Math.max(2, currentPageNum - 1);
    let end = Math.min(totalPages - 1, currentPageNum + 1);

    // Adjust if we're at the beginning or end
    if (currentPageNum <= 3) {
      end = Math.min(totalPages - 1, 4);
    } else if (currentPageNum >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
    }

    // Add ellipsis if needed before our range
    if (start > 2) {
      pages.push('ellipsis-start');
    }

    // Add our range of pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed after our range
    if (end < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* First page button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(1)}
            disabled={currentPageNum === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
            className={
              currentPageNum === 1 ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Number(page));
                }}
                isActive={currentPageNum === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPageNum + 1))
            }
            className={
              currentPageNum === totalPages
                ? 'pointer-events-none opacity-50'
                : ''
            }
          />
        </PaginationItem>

        {/* Last page button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPageNum === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
