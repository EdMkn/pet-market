import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { Album } from '@prisma/client'

const CART_LOCALSTORAGE_KEY = 'vinyl_records_cart'

type CartItem = Album & {
    quantity: number;
}

type CartState = {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
}

export const CartStore = signalStore({
    providedIn: 'root'
},
withState(() => {
    if('localStorage' in globalThis) {
        return {
            ...initialState,
            items: JSON.parse(
                localStorage.getItem(CART_LOCALSTORAGE_KEY) ?? '[]'
            ) as CartItem[]
        }
    }
    return initialState;
}),
withComputed((store) => ({
    totalItems: computed(() =>
        store.items().reduce((acc, items) => {
            return acc + items.quantity;
        }, 0)
    ),
    totalAmount: computed(() =>
        store.items().reduce((acc, items) => {
            return acc + items.quantity * items.price;
        }, 0)
    )
})),
withMethods((store) => ({
    addToCart(album: Album, quantity = 1){
        const currentItems = store.items();
        const existingItem = currentItems.find(cartItem => cartItem.id === album.id);

        if(existingItem) {
            const updatedItems = store.items().map((cartItem) => {
                if (cartItem.id === album.id) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity + quantity
                    };
                }
                return cartItem;
            })
            patchState(store, {
                items: updatedItems
            })
        } else {
            patchState(store, {
                items: [...store.items(), {
                    ...album,
                    quantity
                }]
            })
        }

        localStorage.setItem(
            CART_LOCALSTORAGE_KEY,
            JSON.stringify(store.items())
        );
    },
    updateQuantity(albumId: string, quantity: number) {
        const updatedItems = store 
            .items()
            .map((item) => (item.id === albumId ? { ...item, quantity } : item));
        patchState(store, {items : updatedItems });
        localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(updatedItems)) 
    },
    removeFromCart(albumId: string) {
        const updatedItems = store
          .items()
          .filter((item) => item.id !== albumId);
        patchState(store, { items: updatedItems });
        localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(updatedItems));
      },
      clearCart() {
        patchState(store, {
          items: [],
        });
        localStorage.removeItem(CART_LOCALSTORAGE_KEY);
      },
})))
