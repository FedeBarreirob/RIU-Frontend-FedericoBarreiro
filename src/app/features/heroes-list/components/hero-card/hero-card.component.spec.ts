import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCardComponent } from './hero-card.component';
import { ActivatedRoute } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { Hero } from '@app/interfaces/hero.interface';
import { MatDialog } from '@angular/material/dialog';
import { HeroService } from '@app/services/hero.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockHeroService: jasmine.SpyObj<HeroService>;

  const mockHero: Hero = {
    id: '123',
    name: 'Superman',
    power: 'Super fuerza',
    image: 'superman.jpg',
    description: 'El hombre de acero',
    createdAt: new Date(),
  };


  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockHeroService = jasmine.createSpyObj('HeroService', ['editHero']);

    await TestBed.configureTestingModule({
      imports: [HeroCardComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: ActivatedRoute, useValue: {} },
        { provide: MatDialog, useValue: mockDialog },
        { provide: HeroService, useValue: mockHeroService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hero', mockHero);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show hero data', () => {
    const nameElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    const powerElement = fixture.debugElement.query(By.css('p.bg-yellow-500')).nativeElement;
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(nameElement.textContent).toContain(mockHero.name);
    expect(powerElement.textContent).toContain(mockHero.power);
    expect(imgElement.src).toContain(mockHero.image);
  });

  it('should edit a hero', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed'], {
      componentInstance: { heroData: { set: jasmine.createSpy() } }
    });

    dialogRefSpyObj.afterClosed.and.returnValue(of({ name: 'Batman', power: 'Detective' }));
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.editHero(new Event('click'));

    expect(mockDialog.open).toHaveBeenCalled();
    expect(dialogRefSpyObj.componentInstance.heroData.set).toHaveBeenCalledWith(mockHero);
    expect(mockHeroService.editHero).toHaveBeenCalledWith(mockHero.id, { name: 'Batman', power: 'Detective' });
  });

  it('should open SweetAlert modal when deleteHero is calle', () => {
    let swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true }));
    component.deleteHero(new Event('click'));
    expect(swalSpy).toHaveBeenCalled();
  });

});
