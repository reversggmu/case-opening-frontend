import { Routes } from '@angular/router';
import { BoxComponent } from './components/box/box.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateBoxComponent } from './components/create-box/create-box.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'box/:id',
        component: BoxComponent
    },
    {
        path: 'create-box',
        component: CreateBoxComponent
    },
    {
        path: 'history',
        component: HistoryComponent
    }
];
  