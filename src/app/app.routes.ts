import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { Login } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { LayoutComponent } from './layout/layout/layout';
import { ProductDetailComponent } from './product/product-detail.component';
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
import { LocationDetailComponent } from './location/location-detail.component';
import { ReportComponent } from './report/report.component';
import { Register } from './auth/login/register';
import { authGuard } from './guards/auth.guard';
import { PackingListComponent } from './packing/packing-list.component';
import { PackingFormComponent } from './packing/packing-form.component';
import { PackingDetailComponent } from './packing/packing-detail.component';
import { ReceiveListComponent } from './receive/receive-list.component';
import { ReceiveDetailComponent } from './receive/receive-detail.component';
import { ReceiveFormComponent } from './receive/receive-form.component';
import { UserListComponent } from './user/user-list.component';



export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
        { path: 'products', component: ProductListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales', 'warehouse'] }},
        { path: 'products/detail/:id', component: ProductDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales', 'warehouse'] } },
        { path: 'products/add', component: ProductFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales', 'warehouse'] } },
        { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales', 'warehouse'] } },
        { path: 'sales', component: SalesListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales',] } },
        { path: 'sales/add', component: SalesFormComponent, canActivate: [authGuard, RoleGuard],data: { roles: ['admin', 'sales',] } },
        { path: 'sales/edit/:id', component: SalesFormComponent, canActivate: [authGuard, RoleGuard],data: { roles: ['admin', 'sales',] } },
        { path: 'sales/detail/:id', component: SalesDetailComponent, canActivate: [authGuard, RoleGuard],data: { roles: ['admin', 'sales',] } },
        { path: 'packing', component: PackingListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'packing/add', component: PackingFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'packing/edit/:id', component: PackingFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'packing/detail/:id', component: PackingDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'purchases', component: PurchaseListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'purchases/add', component: PurchaseFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'purchases/edit/:id', component: PurchaseFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'purchases/detail/:id', component: PurchaseDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'customers', component: CustomerListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales'] } },
        { path: 'customers/add', component: CustomerFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales'] } },
        { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales'] } },
        { path: 'customers/detail/:id', component: CustomerDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'sales'] } },
        { path: 'suppliers', component: SupplierListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'suppliers/add', component: SupplierFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'suppliers/edit/:id', component: SupplierFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'suppliers/detail/:id', component: SupplierDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'locations', component: LocationListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'locations/add', component: LocationFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'locations/edit/:id', component: LocationFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'locations/detail/:id', component: LocationDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'receive', component: ReceiveListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'receive/add', component: ReceiveFormComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'receive/detail/:id', component: ReceiveDetailComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin', 'warehouse'] } },
        { path: 'reports', component: ReportComponent, canActivate: [authGuard, RoleGuard] },
        { path: 'users', component: UserListComponent, canActivate: [authGuard, RoleGuard], data: { roles: ['admin'] } }

    ]
  },
  { path: '**', redirectTo: 'login' }
];
