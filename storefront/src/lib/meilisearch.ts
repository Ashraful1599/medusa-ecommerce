import { MeiliSearch } from "meilisearch"

// IMPORTANT: NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY must be a search-only key.
// Never use a master or admin key here — this value is exposed in the client bundle.
export const meili = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY ?? "",
})
