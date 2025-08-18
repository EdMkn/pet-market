import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { AlbumStore } from '../stores/album.store';
import { AlbumCardComponent } from '../components/album-card/album-card.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import untilDestroyed from '../utils/untilDestroyed';
import { CartStore } from '../stores/cart.store';

@Component({
  selector: 'app-albums',
  imports: [AlbumCardComponent, FormsModule],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent {
  searchTerm = '';
  selectedGenre = '';
  albumStore = inject(AlbumStore);
  cartStore = inject(CartStore);
  platformId = inject(PLATFORM_ID);
  searchSubject = new Subject<string>();
  destroyed = untilDestroyed();

  constructor() {
    console.log('🔄 AlbumsComponent - Constructor called', {
      platform: typeof window !== 'undefined' ? 'browser' : 'server',
      location: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString()
    });
    
    // Load albums immediately - the store will handle platform detection
    this.albumStore.loadAlbums();
    
    // Set up search after render (browser only)
    afterNextRender(() => {
      console.log('🔄 AlbumsComponent - Setting up search after render');
      this.searchSubject
        .pipe(debounceTime(500), distinctUntilChanged(), this.destroyed())
        .subscribe((term) => {
          console.log('🔍 Search term:', { term });
          this.albumStore.searchAlbums(term)
        });
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  filterByGenre(genre: string) {
    this.selectedGenre = genre;
    // For now, we'll just update the search term to include genre
    // In a real implementation, you might want to add genre filtering to the store
    if (genre) {
      this.searchSubject.next(genre);
    } else {
      this.searchSubject.next('');
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedGenre = '';
    this.albumStore.loadAlbums();
  }
}
