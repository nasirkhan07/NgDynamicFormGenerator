import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import {AppComponent} from './app.component'

export const ROUTES: Routes = [
  { path: '',  redirectTo:"/home",pathMatch:"full"},
  { path: 'home',  component: HomeComponent }
];
