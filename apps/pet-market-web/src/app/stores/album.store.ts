import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Album } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, map, tap } from 'rxjs';

const GET_ALBUMS = gql`
  query GetAlbums {
    albums {
      id
      name
      artist
      description
      price
      image
      genre
      releaseYear
      trackCount
      duration
      stripePriceId
      isFeatured
      createdAt
      updatedAt
    }
  }
`;

const SEARCH_ALBUMS = gql`
  query SearchAlbums($searchTerm: String!) {
    searchAlbums(term: $searchTerm) {
      id
      name
      artist
      description
      price
      image
      genre
      releaseYear
      trackCount
      duration
      stripePriceId
      isFeatured
      createdAt
      updatedAt
    }
  }
`;

export interface AlbumState {
  albums: Album[];
  featuredAlbums: Album[];
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  featuredAlbums: [],
  loading: false,
  error: null,
};

export const AlbumStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    loadAlbums() {
      patchState(store, { loading: true, error: null });
      apollo
        .watchQuery<{ albums: Album[] }>({
          query: GET_ALBUMS,
        })
        .valueChanges.pipe(
          tap({
            next: ({ data }) =>
              patchState(store, { albums: data.albums, loading: false }),
            error: (error) =>
              patchState(store, { error: error.message, loading: false }),
          })
        )
        .subscribe();
    },
    searchAlbums(term: string) {
      patchState(store, { loading: true, error: null });
      apollo
        .query<{ searchAlbums: Album[] }>({
          query: SEARCH_ALBUMS,
          variables: {
            searchTerm: term
          }
        })
        .pipe(
          map(({ data }) =>
            patchState(store, { albums: data.searchAlbums, loading: false })
            ),
            catchError((error) => {
              patchState(store, {error: error.message, loading: false});
              return EMPTY;
            })

        )
        .subscribe();
    },
  }))
);