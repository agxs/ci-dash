import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CiService } from "./ci.service";
import { HttpClientModule } from "@angular/common/http";
import { ProjectComponent } from "./project.component";
import { ProjectsComponent } from './projects.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [CiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
