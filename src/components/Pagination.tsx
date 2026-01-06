import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const maxPages = Math.min(totalPages, 500); // TMDB limita a 500 páginas
    const pages: (number | string)[] = [];

    if (maxPages <= 7) {
        for (let i = 1; i <= maxPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(maxPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < maxPages - 2) {
            pages.push("...");
        }

        pages.push(maxPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg glass border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {pages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg transition-all duration-200 ${currentPage === page
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "glass border border-border hover:border-primary/50 text-foreground"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === maxPages}
                className="p-2 rounded-lg glass border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
