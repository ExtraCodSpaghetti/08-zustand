"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../../../lib/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import type { FetchNotesResponse } from "../../../../lib/api";
import css from "./NotesClient.module.css";
import Link from "next/link";

interface NotesClientProps {
  initialData: FetchNotesResponse;
  tag: string;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearchTerm, tag],
    queryFn: () =>
      fetchNotes(
        page,
        12,
        debouncedSearchTerm,
        tag.toLowerCase() === "all" ? undefined : tag,
      ),
    placeholderData: keepPreviousData,
    initialData:
      page === 1 && debouncedSearchTerm === "" ? initialData : undefined,
  });

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onSearch={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
}
