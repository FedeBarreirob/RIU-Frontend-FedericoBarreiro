import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Hero } from '@app/interfaces/hero.interface';

@Component({
  selector: 'app-hero-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './hero-dialog.component.html',
  styleUrl: './hero-dialog.component.css'
})
export class HeroDialogComponent {
  fb = inject(FormBuilder);
  dialogRef: MatDialogRef<HeroDialogComponent> = inject(MatDialogRef);
  heroForm!: FormGroup;
  heroData = signal<Hero | null>(null);
  imagePreview!: string;

  ngOnInit() {
    this.initForm();
    this.loadImage();
  }

  initForm() {
    this.heroForm = this.fb.group({
      name: [this.heroData()?.name || '', [Validators.required, Validators.maxLength(24)]],
      power: [this.heroData()?.power || '', [Validators.required, , Validators.maxLength(10)]],
      description: [this.heroData()?.description || '', [Validators.required, , Validators.maxLength(50)]],
      image: [this.heroData()?.image || '', Validators.required],
      createdAt: [new Date()]
    });

    this.transformToUpperCase();
  }

  loadImage() {
    if (this.heroData()?.image) {
      this.imagePreview = this.heroData()?.image || '';
    }
  }

  saveHero() {
    if (this.heroForm.valid) {
      this.dialogRef.close(this.heroForm.value);
    }
  }

  onFileSelected(event: any): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten archivos de imagen (jpg, png, webp)');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.heroForm.patchValue({ image: this.imagePreview });
      };
    }
  }

  transformToUpperCase() {
    this.heroForm.get('name')?.valueChanges.subscribe(value => {
      if (value) {
        this.heroForm.patchValue({ name: value.toUpperCase() }, { emitEvent: false });
      }
    });
  }

  close() {
    this.dialogRef.close(null);
  }
}
