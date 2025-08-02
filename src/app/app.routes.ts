import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { LayoutComponent } from './layout/layout/layout';
import { ProductComponent } from './product/product-detail.component';
import { ProductFormComponent } from './product/product-form.component';
import { ProductListComponent } from './product/product-list.component';
import { SalesListComponent } from './sales/sales-list.component';
import { SalesFormComponent } from './sales/sales-form.component';
import { SalesDetailComponent } from './sales/sales-detail.component';
import { PurchaseListComponent } from './purchases/purchase-list.component';
import { PurchaseFormComponent } from './purchases/purchase-form.component';
import { PurchaseDetailComponent } from './purchases/purchase-detail.component';
import { CustomerListComponent } from './customer/customer-list.component';
import { CustomerFormComponent } from './customer/customer-form.component';
import { CustomerDetailComponent } from './customer/customer-detail.component';
import { SupplierListComponent } from './supplier/supplier-list.component';
import { SupplierFormComponent } from './supplier/supplier-form.component';
import { SupplierDetailComponent } from './supplier/supplier-detail.component';
import { LocationListComponent } from './location/location-list.component';
import { LocationFormComponent } from './location/location-form.component';
import { ReportComponent } from './report/report.component';
import { Register } from './auth/login/register';



export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'products', component: ProductListComponent },
        { path: 'products/detail/:code', component: ProductComponent },
        { path: 'products/add', component: ProductFormComponent },
        { path: 'products/edit/:code', component: ProductFormComponent },
        { path: 'sales', component: SalesListComponent },
        { path: 'sales/add', component: SalesFormComponent },
        { path: 'sales/detail/:id', component: SalesDetailComponent },
        { path: 'purchases', component: PurchaseListComponent },
        { path: 'purchases/add', component: PurchaseFormComponent },
        { path: 'purchases/detail/:id', component: PurchaseDetailComponent },
        { path: 'customers', component: CustomerListComponent },
        { path: 'customers/add', component: CustomerFormComponent },
        { path: 'customers/edit/:id', component: CustomerFormComponent },
        { path: 'customers/detail/:id', component: CustomerDetailComponent },
        { path: 'suppliers', component: SupplierListComponent },
        { path: 'suppliers/add', component: SupplierFormComponent },
        { path: 'suppliers/edit/:id', component: SupplierFormComponent },
        { path: 'suppliers/detail/:id', component: SupplierDetailComponent },
        { path: 'locations', component: LocationListComponent },
        { path: 'locations/add', component: LocationFormComponent },
        { path: 'reports', component: ReportComponent }
    ]
  },
  //{ path: '**', redirectTo: 'login' }
];

