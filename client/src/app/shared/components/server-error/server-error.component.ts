import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [MatCard, MatButton, RouterLink],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent {
  error?: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }
}
