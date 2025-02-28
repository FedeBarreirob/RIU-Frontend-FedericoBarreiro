import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDialogComponent } from './hero-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Hero } from '@app/interfaces/hero.interface';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('HeroDialogComponent', () => {
  let component: HeroDialogComponent;
  let fixture: ComponentFixture<HeroDialogComponent>;
  let mockDialogRef: MatDialogRef<HeroDialogComponent>;

  beforeEach(() => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    } as any;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, HeroDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        provideAnimationsAsync(),
      ]
    });

    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with hero data if available', () => {
    const heroData: Hero = {
      id: '123',
      name: 'Superman',
      power: 'Flight',
      description: 'The man of steel',
      image: '',
      createdAt: new Date()
    };

    component.heroData.set(heroData);
    component.ngOnInit();

    expect(component.heroForm.get('name')?.value).toBe(heroData.name);
    expect(component.heroForm.get('power')?.value).toBe(heroData.power);
    expect(component.heroForm.get('description')?.value).toBe(heroData.description);
    expect(component.heroForm.get('image')?.value).toBe(heroData.image);
  });

  it('should mark name as required and check maxlength validation', () => {
    const nameControl = component.heroForm.get('name');
    nameControl?.setValue('');
    fixture.detectChanges();

    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.hasError('required')).toBeTrue();

    nameControl?.setValue('A very long name for a superhero');
    fixture.detectChanges();
    expect(nameControl?.hasError('maxlength')).toBeTrue();
  });

  it('should mark description as required and check maxlength validation', () => {
    const descriptionControl = component.heroForm.get('description');
    descriptionControl?.setValue('');
    fixture.detectChanges();

    expect(descriptionControl?.valid).toBeFalse();
    expect(descriptionControl?.hasError('required')).toBeTrue();
  });

  it('should call dialogRef.close on close()', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should transform the name to uppercase', () => {
    const nameControl = component.heroForm.get('name');
    nameControl?.setValue('superman');
    fixture.detectChanges();

    expect(nameControl?.value).toBe('SUPERMAN');
  });

  it('should update imagePreview when a valid image is selected', () => {
    const file = new File(['dummy content'], 'hero.png', { type: 'image/png' });
  
    const mockFileReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onload: null as any,
      result: 'data:image/png;base64,someBase64String'
    };
  
    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);
  
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
  
    if (mockFileReader.onload) {
      mockFileReader.onload();
    }
  
    expect(component.imagePreview).toContain('data:image/png;base64');
  });
  
  it('should not update imagePreview if an invalid file type is selected', () => {
    spyOn(window, 'alert');
    const file = new File(['dummy content'], 'hero.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as any;
  
    component.onFileSelected(event);
    fixture.detectChanges();
  
    expect(window.alert).toHaveBeenCalledWith('Solo se permiten archivos de imagen (jpg, png, webp)');
    expect(component.imagePreview).toBeUndefined();
  });
  
});
