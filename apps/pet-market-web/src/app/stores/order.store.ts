import { inject } from '@angular/core';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import { Order, AlbumOrderItem, Album } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { tap } from 'rxjs';


const GET_ORDER = gql`
    query GetOrder($id: String!) {
        order(id: $id) {
            id
            totalAmount
            status
            items {
                id
                quantity
                price
                album {
                    id
                    name
                    price
                    image
                }
            }
        }
    }
`;

type OrderItemWithAlbum = AlbumOrderItem & {
    album: Album ;
};

export type OrderWithItems = Order & {items: OrderItemWithAlbum[]};

type OrderState = {
    orders: OrderWithItems[];
    orderDetail: OrderWithItems | null;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    orderDetail: null,
    error: null,
}

export const OrderStore = signalStore(
    {
        providedIn: 'root',
    },
    withState(() => initialState),
    withMethods((store, apollo = inject(Apollo)) => ({
        getOrder: (id: string) => {
            patchState(store, {  error: null,});

            return apollo.query<{order: OrderWithItems}>({
                query: GET_ORDER,
                variables: {id},
            }).pipe(
                tap({
                    next: ({data}) => {
                        patchState(store, {
                            orderDetail: data.order,
                        });
                    },
                    error: (error) => {
                        patchState(store, {
                            error: error.message,
                        });
                    },
                })
            );
        },
        setError: (error: string) => {
            patchState(store, {
                error,
            });
        }
    }))
);