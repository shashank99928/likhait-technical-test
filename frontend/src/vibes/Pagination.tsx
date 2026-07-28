/**
 * Reusable Pagination component
 */

import React from "react";
import { COLORS } from "../constants/colors";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1rem 0",
  };

  const pageInfoStyle: React.CSSProperties = {
    color: COLORS.text.secondary,
    fontSize: "0.875rem",
    margin: "0 1rem",
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav style={containerStyle} aria-label="Pagination">
      <Button
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Previous
      </Button>
      <span style={pageInfoStyle} aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </Button>
    </nav>
  );
}
