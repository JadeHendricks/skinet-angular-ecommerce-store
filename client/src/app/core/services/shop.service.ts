import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../shared/models/products';
import { Pagination } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:5001/api/';
  private types: string[] = [];
  private brands: string[] = [];

  public getProducts() {
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products?pageSize=20');
  }

  public getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response
    });    
  }

  public getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response
    });
  }
}
