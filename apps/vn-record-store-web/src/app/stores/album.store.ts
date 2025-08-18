import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Album } from '../types/album.types';
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
  withMethods((store, apollo = inject(Apollo), platformId = inject(PLATFORM_ID)) => ({
    loadAlbums() {
      console.log('🔄 AlbumStore.loadAlbums() - Starting to load albums', {
        platform: isPlatformBrowser(platformId) ? 'browser' : 'server',
        windowExists: typeof window !== 'undefined',
        location: typeof window !== 'undefined' ? window.location.href : 'N/A'
      });
      
      // Absolutely prevent GraphQL calls during SSR
      if (!isPlatformBrowser(platformId)) {
        console.log('🚫 AlbumStore - SSR detected, aborting GraphQL call');
        patchState(store, { loading: false, error: null });
        return;
      }
      
      console.log('✅ AlbumStore - Browser confirmed, proceeding with GraphQL', {
        apolloClient: !!apollo,
        query: GET_ALBUMS.loc?.source?.body?.substring(0, 50) + '...'
      });
      patchState(store, { loading: true, error: null });
      
      console.log('🚀 AlbumStore - About to make watchQuery request');
      
      apollo
        .watchQuery<{ albums: Album[] }>({
          query: GET_ALBUMS,
          errorPolicy: 'all',
          fetchPolicy: 'cache-first'
        })
        .valueChanges.pipe(
          tap({
            next: ({ data, loading, error }) => {
              console.log('✅ AlbumStore - GraphQL Success:', { 
                albumCount: data?.albums?.length || 0, 
                loading, 
                hasError: !!error 
              });
              if (data?.albums) {
                patchState(store, { albums: data.albums, loading: false });
              }
            },
            error: (error) => {
              console.error('❌ AlbumStore - GraphQL Error:', {
                message: error.message,
                networkError: error.networkError,
                graphQLErrors: error.graphQLErrors,
                apolloLink: apollo.client?.link,
                uri: (apollo.client?.link as any)?.uri || 'unknown'
              });
              patchState(store, { error: error.message, loading: false });
            }
          }),
          catchError((error) => {
            console.error('❌ AlbumStore - Catch Error:', error);
            patchState(store, { error: error.message, loading: false });
            return EMPTY;
          })
        )
        .subscribe();
    },
    searchAlbums(term: string) {
      console.log('🔍 AlbumStore.searchAlbums() - Starting search for:', term);
      
      // Absolutely prevent GraphQL calls during SSR
      if (!isPlatformBrowser(platformId)) {
        console.log('🚫 AlbumStore - SSR detected, aborting search GraphQL call');
        patchState(store, { loading: false, error: null });
        return;
      }
      
      console.log('✅ AlbumStore - Browser confirmed, proceeding with search GraphQL');
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