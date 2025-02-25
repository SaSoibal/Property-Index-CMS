import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from './modules/material.module';
import { NgZorroAntdModule } from './modules/ng-zorro-ant.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './core_classes/auth-guard';
import { CommonService, LeadsDetails } from './services/common.service';
import { CareerComponent } from './pages/career/career.component';
import { JobsComponent } from './pages/career/jobs/jobs.component';
import { CvBankComponent } from './pages/career/cv-bank/cv-bank.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ContactFormsComponent } from './pages/contact-forms/contact-forms.component';
import { AddPropertyFormsComponent } from './pages/add-property-forms/add-property-forms.component';
import {RequestPropertyFormsComponent} from './pages/request-property-forms/request-property-forms.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        NgxPaginationModule,
        MaterialModule,
        NgZorroAntdModule,
        NgbModule,
        RouterModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        LeadsDetails,
        CareerComponent,
        JobsComponent,
        CvBankComponent,
        ContactUsComponent,
        ContactFormsComponent,
        AddPropertyFormsComponent,
        RequestPropertyFormsComponent
    ],
    providers: [
        AuthService,
        AuthGuard,
        { provide: NZ_I18N, useValue: en_US }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
