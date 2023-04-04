import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ChallengesComponent } from './components/challenges/challenges.component';
import { WelcomeComponent } from './components/welcome/welcome.component'

import { AuthGuard } from './shared/guard/auth.guard';
import { DogGuard } from './shared/guard/dog.guard';
import { DogInfoComponent } from './components/dog-info/dog-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'challenges', component: ChallengesComponent, canActivate: [DogGuard] },
  { path: 'dog-info', component: DogInfoComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
