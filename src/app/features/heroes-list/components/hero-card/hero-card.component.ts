import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hero } from '@app/interfaces/hero.interface';
import { HeroService } from '@app/services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { HeroDialogComponent } from '../hero-dialog/hero-dialog.component';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-hero-card',
  imports: [MatIconModule, MatTooltipModule, DatePipe, RouterLink, CommonModule],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.css'
})
export class HeroCardComponent {
  dialog = inject(MatDialog);
  heroService = inject(HeroService);
  hero = input.required<Hero>();
  listView = input<boolean>();

  editHero(event: Event) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(HeroDialogComponent);
    dialogRef.componentInstance.heroData.set(this.hero())
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.heroService.editHero(this.hero().id, res);
      }
    });
  }

  deleteHero(event: Event) {
    event.stopPropagation();
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
        this.heroService.removeHero(this.hero().id);
      }
    });
  }
}
