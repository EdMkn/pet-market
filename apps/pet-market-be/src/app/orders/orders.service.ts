import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {

  }
  create(createOrderInput: CreateOrderInput) {
    const {totalAmount, albumItems} = createOrderInput;
    return this.prisma.order.create({
      data: {
        totalAmount,
        status: 'PENDING',
        albumItems: {
          create: albumItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            album: {
              connect: {
                id: item.albumId
              },
            },
          })),
        },
      },
      include: {
        albumItems: {
          include: {
            album: true
          }
        }
      }
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        albumItems: {
          include: {
            album: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        albumItems: {
          include: {
            album: true,
          },
        },
      },
    });
  }

  update(id: string, updateOrderInput: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderInput,
    });
  }

    remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
