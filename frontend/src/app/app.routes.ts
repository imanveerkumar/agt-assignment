import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Categories } from './components/categories/categories';
import { Products } from './components/products/products';
import { Upload } from './components/upload/upload';
import { Reports } from './components/reports/reports';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'users', component: Users },
      { path: 'categories', component: Categories },
      { path: 'products', component: Products },
      { path: 'upload', component: Upload },
      { path: 'reports', component: Reports }
    ]
  }
];
