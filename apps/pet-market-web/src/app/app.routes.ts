import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadComponent: async() => {
            const mod = await import('./home/home.component');
            return mod.HomeComponent;
        }
    },
    {
        path: 'albums',
        loadComponent: async () => {
            const mod = await import('./albums/albums.component');
            return mod.AlbumsComponent;
        }
    },
    {
        path: 'cart',
        loadComponent: async() => {
            const mod = await import('./cart/cart.component');
            return mod.CartComponent;
        }
    },
    {
        path: 'checkout/cancel',
        loadComponent: async() => {
            const mod = await import('./checkout/checkout-failure/checkout-failure.component');
            return mod.CheckoutFailureComponent;
        }
    },
    {
        path: 'checkout/success',
        loadComponent: async() => {
            const mod = await import('./checkout/checkout-success/checkout-success.component');
            return mod.CheckoutSuccessComponent;
        }
    },
    {
        path: 'checkout',
        loadComponent: async() => {
            const mod = await import('./checkout/checkout.component');
            return mod.CheckoutComponent;
        }
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
