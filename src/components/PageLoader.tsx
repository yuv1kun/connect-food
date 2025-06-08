import React from 'react';

interface PageLoaderProps {
  loadingText?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ loadingText = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin text-primary h-12 w-12 mb-4"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p className="text-lg font-medium text-foreground">{loadingText}</p>
    </div>
  );
};

export default PageLoader;
