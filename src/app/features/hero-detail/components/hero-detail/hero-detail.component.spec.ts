import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '@app/services/hero.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { exampleHero } from '@app/interfaces/hero.interface';
import { By } from '@angular/platform-browser';
import Swal from 'sweetalert2';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockLocation: jasmine.SpyObj<Location>;
  const mockHero = exampleHero
  let heroService: HeroService;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getHero', 'editHero']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        HeroDetailComponent
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 'hero-id' } }
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHero', () => {
    mockHeroService.getHero.and.returnValue(mockHero);
    component.ngOnInit();
    expect(mockHeroService.getHero).toHaveBeenCalledWith('hero-id');
  });

  it('should call goBack and navigate back', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should open SweetAlert modal when deleteHero is calle', () => {
    let swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true }));
    component.deleteHero();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('should open the edit modal when clicking the edit button', () => {
    const editButton = fixture.debugElement.query(By.css('[data-testid="edit-button"]'));

    editButton.triggerEventHandler('click', null);

    spyOn(component, 'editHero');
    component.editHero();
    expect(component.editHero).toHaveBeenCalled();

    expect(mockDialog.open).toHaveBeenCalled();
  })

  it('should navigate to home if hero is not found', () => {
    mockHeroService.getHero.and.returnValue(null);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
