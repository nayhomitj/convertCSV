import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SpinnerComponent } from '../app/components/shared/spinner/spinner.component';
import { MessageComponent } from '../app/components/shared/message/message.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/shared/footer/footer.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SpinnerComponent,
    MessageComponent,
    HomeComponent,
    FooterComponent],

  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule

  ],
  entryComponents: [
    SpinnerComponent,
    MessageComponent
  ],
  exports: [
    SpinnerComponent,
    MessageComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
