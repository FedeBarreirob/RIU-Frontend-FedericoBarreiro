import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '', loadComponent: () => import('./features/heroes-list/components/hero-list/hero-list.component').then(m => m.HeroListComponent)
            },
            {
                path:':id', loadComponent: () => import('./features/hero-detail/components/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
            }
        ]
    }
];
