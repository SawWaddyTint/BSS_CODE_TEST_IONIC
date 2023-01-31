import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';

@NgModule({
  declarations: [AppComponent,SearchEmployeeComponent,],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,  
            FormsModule,
            ReactiveFormsModule,           
          ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
                DatePipe,
                SQLite, 
                Storage,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
