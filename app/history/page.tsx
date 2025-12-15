/**
 * History page - Browse and manage past recordings
 */

'use client';

import React, { useState } from 'react';
import { Search, History as HistoryIcon } from 'lucide-react';
import { RecordingsList } from '@/components/RecordingsList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRecordings } from '@/hooks/useRecordings';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { recordings, isLoading, error, deleteRecording, searchRecordings, fetchRecordings } =
    useRecordings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      searchRecordings(searchQuery);
    } else {
      fetchRecordings();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchRecordings();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <HistoryIcon size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Recording History
            </h2>
            <p className="text-muted-foreground">
              Browse, search, and manage your voice recordings
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recordings by title or transcript..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary/80"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner size="lg" message="Loading recordings..." />
        </div>
      )}

      {/* Recordings List */}
      {!isLoading && (
        <>
          {/* Stats */}
          <div className="mb-6 text-sm text-muted-foreground">
            {searchQuery ? (
              <p>
                Found {recordings.length} recording{recordings.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
            ) : (
              <p>
                {recordings.length} total recording{recordings.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Recordings */}
          <RecordingsList
            recordings={recordings}
            onDelete={deleteRecording}
            className="animate-fadeIn"
          />
        </>
      )}
    </div>
  );
}
