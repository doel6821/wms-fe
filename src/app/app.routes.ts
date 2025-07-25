import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { LayoutComponent } from './layout/layout/layout';
import { ProductComponent } from './product/product';

export const routes: Routes = [
  { 
    path: 'login', 
    component: Login },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product', component: ProductComponent },
    ]
  },
  //{ path: '**', redirectTo: 'login' }
];

