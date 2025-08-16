import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Album } from '@prisma/client'

@Component({
  selector: 'app-album-card',
  imports: [CommonModule],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.scss',
})
export class AlbumCardComponent {

  album = input.required<Album>();
  addToCart = output<Album>()

  onAddToCart(album: Album) {
    this.addToCart.emit(album);
    }
}
