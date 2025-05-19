import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/products';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-product-details',
  imports: [MatButton, MatDivider, MatIcon, MatInput, MatFormField, MatLabel, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private route = inject(ActivatedRoute);

  product?: Product;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
      this.shopService.getProduct(+id).subscribe({
        next: product => this.product = product,
        error: error => console.log(error)
      });
  }

}
