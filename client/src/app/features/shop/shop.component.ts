import { Component, inject } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";

@Component({
  selector: 'app-shop',
  imports: [MatCard, ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  // injections
  private shopService = inject(ShopService);
  
  products: Product[] = [];

  ngOnInit(): void {
    this.initializeShop();
  }

  private initializeShop() {
    this.shopService.getProducts().subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error)
    });
    this.shopService.getBrands();
    this.shopService.getTypes();
  }
}