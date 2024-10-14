import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicSearchResults = dynamic(
  () => import("@/components/Main/SearchResultsPage"),
  {
    loading: () => <div>Loading...</div>
  }
);

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <DynamicSearchResults />
    </Suspense>
  );
}
