import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeroService } from '@app/services/hero.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Hero } from '@app/interfaces/hero.interface';
import { of } from 'rxjs';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroService: HeroService;
  let mockHeroes = [
    { id: '1', name: 'Spiderman', power: 'Web-slinging', createdAt: new Date(), description: '', image: '' },
    { id: '2', name: 'Ironman', power: 'Armor', createdAt: new Date(), description: '', image: '' },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [provideAnimationsAsync(),
      {
        provide: ActivatedRoute,
        useValue: {}
      }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    heroService = TestBed.inject(HeroService);
    component = fixture.componentInstance;
    heroService.heroes.set(mockHeroes)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a list of heroes', () => {
    spyOn(heroService, 'getAllHeroes').and.returnValue(mockHeroes);
    expect(component.heroes()).toEqual(mockHeroes);
  });

  it('should filter heroes', () => {
    component.filterText.set('super');
    expect(component.paginatedHeroes().every(hero => hero.name.toLowerCase().includes('super'))).toBeTrue();
  });

  it('should open dialog to add a hero', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.addHero();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should update pagination when onPageChange is called', () => {
    const event: PageEvent = { pageIndex: 1, pageSize: 8, length: mockHeroes.length };

    component.onPageChange(event);

    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(8);
  });

  it('should open dialog to add a hero', () => {
    const newHero: Hero = { id: '3', name: 'Batman', power: 'Detective skills', createdAt: new Date(), description: '', image: '' };
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(newHero) 
    } as any);

    spyOn(heroService, 'addHero');

    component.addHero();

    expect(component.dialog.open).toHaveBeenCalled();
    expect(heroService.addHero).toHaveBeenCalledWith(newHero);
  });

  it('should display the correct number of hero cards', () => {
    fixture.detectChanges();
    const heroCards = fixture.nativeElement.querySelectorAll('app-hero-card');
    expect(heroCards.length).toBe(component.paginatedHeroes().length);
  });

});
