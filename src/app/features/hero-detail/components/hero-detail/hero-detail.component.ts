import { Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroDialogComponent } from '@app/features/heroes-list/components/hero-dialog/hero-dialog.component';
import { Hero } from '@app/interfaces/hero.interface';
import { HeroService } from '@app/services/hero.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hero-detail',
  imports: [MatIconModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent {
  heroService = inject(HeroService);
  router = inject(Router);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  location = inject(Location);
  hero = computed(() => this.heroService.getHero(this.heroId));
  heroId = this.route.snapshot.params['id'];

  ngOnInit() {
    if (!this.hero()?.id) {
      this.router.navigate(['']);
    }
  }

  goBack() {
    this.location.back()
  }

  editHero() {
    let dialogRef = this.dialog.open(HeroDialogComponent);
    dialogRef.componentInstance.heroData.set(this.hero());
    dialogRef.afterClosed().subscribe((savedHero: Hero) => {
      if (savedHero) {
        this.heroService.editHero(this.hero()?.id || '', savedHero);
      }
    });
  }

  deleteHero() {
    Swal.fire({
      title: "¿Eliminar heroe?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
      background: "#0F0F0F"
    }).then((result) => {
      if (result.isConfirmed) {
        const heroId = this.hero()?.id;
        if (heroId) {
          this.heroService.removeHero(heroId);
        }
        this.goBack();
      }
    });
  }
}
