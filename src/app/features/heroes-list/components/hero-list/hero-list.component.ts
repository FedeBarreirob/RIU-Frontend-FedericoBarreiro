import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'
import { Hero } from '@app/interfaces/hero.interface';
import { HeroService } from '@app/services/hero.service';
import { HeroCardComponent } from '@app/features/heroes-list/components/hero-card/hero-card.component';
import { HeroDialogComponent } from '@app/features/heroes-list/components/hero-dialog/hero-dialog.component';

@Component({
  selector: 'app-hero-list',
  imports: [MatFormFieldModule, CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, MatIconModule, MatTableModule, HeroCardComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent {
  heroService = inject(HeroService);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['name', 'power', 'actions'];
  filterText = signal("");
  pageSize = signal(4);
  currentPage = signal(0);

  heroes = computed(() => this.heroService.getAllHeroes());
  paginatedHeroes = computed(() => this.heroes().filter(hero => hero.name.toLowerCase().includes(this.filterText().toLowerCase())).slice(this.currentPage() * this.pageSize(), (this.currentPage() + 1) * this.pageSize()));

  setFilterText(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const filterText = input.value;
    this.filterText.set(filterText);
  }

  addHero() {
    let dialogRef = this.dialog.open(HeroDialogComponent);
    dialogRef.afterClosed().subscribe((hero: Hero) => {
      if (hero) {
        this.heroService.addHero(hero);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
  }

  filteredHeroesLength(){
    return this.heroes().filter(hero => hero.name.toLowerCase().includes(this.filterText().toLowerCase())).length;
  }
}
