import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { Hero } from '@app/interfaces/hero.interface';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [HeroService],
    });
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a hero', () => {
    addHero();
    const storedHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    expect(storedHeroes.length).toBe(1);
    expect(storedHeroes[0].name).toBe('Spiderman');
  });

  it('should get hero', () => {
    addHero()
    const storedHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    let hero = service.getHero(storedHeroes[0].id);
    expect(hero!.name).toBe('Spiderman');
  });

  it('should edit a hero', () => {
    addHero();
    const storedHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');

    let heroToEdit = storedHeroes.find((hero: Hero) => hero.name === "Spiderman");

    heroToEdit!.name = "Spiderman 2.0";

    service.editHero(heroToEdit!.id, heroToEdit!);
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    expect(heroes[0].name).toBe('Spiderman 2.0');
  })

  it('should delete a hero', () => {
    addHero();
    const storedHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    const heroToDelete = storedHeroes.find((hero: Hero) => hero.name === "Spiderman");
    service.removeHero(heroToDelete!.id);
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    expect(heroes.length).toBe(0);
  });

  function addHero() {
    const hero: Omit<Hero, 'id'> = {
      name: 'Spiderman',
      createdAt: new Date(),
      description: 'Friendly neighborhood hero',
      image: 'spiderman.jpg',
      power: 'Web-slinging',
    };

    service.addHero(hero);
  }
});
