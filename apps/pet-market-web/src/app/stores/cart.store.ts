import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { Product } from '@prisma/client'

type CartItem = Product & {
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
withState(() => initialState),
withComputed((store) => ({
    totalItems: computed(() =>
        store.items().reduce((acc, items) => {
            return acc + items.quantity;
        }, 0)
    )
})),
withMethods((store) => ({
    addToCart(product: Product, quantity = 1){
        const currentItems = store.items();
        const existingItem = currentItems.find(cartItem => cartItem.id === product.id);

        if(existingItem) {
            const updatedItems = store.items().map((cartItem) => {
                if (cartItem.id === product.id) {
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
                    ...product,
                    quantity
                }]
            })
        }
    }
})))
