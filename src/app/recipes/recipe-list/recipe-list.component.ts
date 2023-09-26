import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select('recipes')
      .pipe(
        map(stateData => stateData.recipes)
      )
      .subscribe(recipes => {
        this.recipes = recipes
      })
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
