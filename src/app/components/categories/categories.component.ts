import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { ICategory } from '../../core/interfaces/icategory';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  // categories: any[] = [];
  categoryList: ICategory[] = [];
  loading: boolean = false;

  constructor(private _CategoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.loading = true;
    this._CategoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categoryList = response.data;
        console.log(this.categoryList);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      }
    });
  }
}
