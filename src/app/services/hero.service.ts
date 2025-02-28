import { Injectable, inject, signal } from '@angular/core';
import { Hero } from '@app/interfaces/hero.interface';
import { v4 as uuidv4 } from 'uuid';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly STORAGE_KEY = 'heroes';
  loadingService = inject(LoadingService);
  heroes = signal<Hero[]>(this.loadFromLocalStorage());

  loadFromLocalStorage(): Hero[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addHero(hero: Omit<Hero, 'id'>): void {
    const newHero: Hero = {
      id: uuidv4(),
      ...hero
    };
    this.heroes.update(heroes => [...heroes, newHero]);
    this.loadingService.simulateFetching();
    this.saveInLocalStorage();
  }

  editHero(id: string, updatedHero: Partial<Hero>): void {
    this.heroes.update(heroes =>
      heroes.map(hero => (hero.id === id ? { ...hero, ...updatedHero } : hero))
    );
    this.loadingService.simulateFetching();
    this.saveInLocalStorage();
  }

  removeHero(id: string): void {
    this.heroes.update(heroes => heroes.filter(hero => hero.id !== id));
    this.loadingService.simulateFetching();
    this.saveInLocalStorage();
  }

  getAllHeroes(): Hero[] {
    return this.heroes();
  }

  getHero(id: string): Hero | null {
    if (this.heroes()) {
      return this.heroes().find((hero: Hero) => hero.id === id) || null;
    } else {
      return null;
    }
  }

  saveInLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.heroes()));
  }
}
