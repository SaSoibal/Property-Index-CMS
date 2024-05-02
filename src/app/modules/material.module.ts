import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper'; 
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TinymceModule} from 'angular2-tinymce';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatRippleModule,
    MatGridListModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    DragDropModule,
    MatStepperModule,
    TinymceModule.withConfig({'auto_focus':false})
  ],
  exports: [
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatRippleModule,
    MatGridListModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    TinymceModule,
    DragDropModule,
    MatStepperModule
  ]
})
export class MaterialModule { }
