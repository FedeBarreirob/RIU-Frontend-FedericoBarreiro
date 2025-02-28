import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = signal(false);

  showLoading(): void {
    this.loading.set(true);
  }

  hideLoading(): void {
    this.loading.set(false);
  }

  isLoading(): boolean {
    return this.loading();
  }

  simulateFetching(): void {
    this.showLoading();
    setTimeout(() => {
      this.hideLoading();
    }, 1500);
  }
}
