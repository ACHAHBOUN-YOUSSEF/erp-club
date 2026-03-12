'use client';
import { ArrowLeftCircle, ArrowRight, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';

interface Props {
    totalPages: number;
    currentPage: number;
    pathname: string;
    searchParams: any;
}

export default function Pagination({ totalPages, currentPage, pathname, searchParams }: Props) {
    const createPageURL = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    // Affiche max 5 pages (1 ... 3 4 5 ... 10)
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center mt-8 space-x-2">
            {/* Précédent */}
            {currentPage > 1 && (
                <Link 
                    href={createPageURL(currentPage - 1)}
                    className="px-2 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                >
                    <ArrowLeftCircle/>
                </Link>
            )}

            {/* Pages */}
            {getVisiblePages().map((page) => (
                page === '...' ? (
                    <span key={page} className="px-2 py-2 text-gray-400">...</span>
                ) : (
                    <Link 
                        key={page}
                        href={createPageURL(Number(page))}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === page 
                                ? 'bg-red-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                    >
                        {page}
                    </Link>
                )
            ))}

            {/* Suivant */}
            {currentPage < totalPages && (
                <Link 
                    href={createPageURL(currentPage + 1)}
                    className="px-2 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                ><ArrowRightCircle/>
                </Link>
            )}
        </div>
    );
}
