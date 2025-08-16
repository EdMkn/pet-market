import { Injectable } from '@nestjs/common';
import { CreateAlbumInput } from './dto/create-album.input';
import { UpdateAlbumInput } from './dto/update-album.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  create(createAlbumInput: CreateAlbumInput) {
    return this.prisma.album.create({
      data: createAlbumInput,
    });
  }

  findAll() {
    return this.prisma.album.findMany();
  }

  findOne(id: string) {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  searchAlbums(term: string) {
    return this.prisma.album.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            artist: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            genre: {
              contains: term,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  update(id: string, updateAlbumInput: UpdateAlbumInput) {
    return this.prisma.album.update({
      where: { id },
      data: updateAlbumInput,
    });
  }

  remove(id: number) {
    return this.prisma.album.delete({
      where: { id: id.toString() },
    });
  }
} 