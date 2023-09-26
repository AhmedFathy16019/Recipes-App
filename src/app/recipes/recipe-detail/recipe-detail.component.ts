import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs';
import { deleteRecipe } from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(stateData => {
          return stateData.recipes.find((recipe, index) => index === this.id);
        })
      )
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
      })
  }

  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ ingredients: this.recipe.ingredients }));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({ index: this.id }));
    this.router.navigate(['/recipes']);
  }

}
