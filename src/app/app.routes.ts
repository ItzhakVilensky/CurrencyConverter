import { Routes } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
    { path: '', component: ConverterComponent },
    { path: 'history', component: HistoryComponent },
    { path: '**', redirectTo: '' }
];
