import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './home/components/login/login.component';
import { WeatherComponent } from './home/components/weather/weather.component'
import { AuthGuardService } from './core/guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: WeatherComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
