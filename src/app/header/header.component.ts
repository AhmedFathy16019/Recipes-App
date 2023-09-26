import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { logout } from '../auth/store/auth.actions';
import { fetchRecipes, storeRecipes } from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.store.dispatch(storeRecipes());
  }

  onFetchData() {
    this.store.dispatch(fetchRecipes());
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
