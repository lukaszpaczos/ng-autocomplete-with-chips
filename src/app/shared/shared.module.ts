import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import {ChipListComponent} from './components/chip-list/chip-list.component';

const SHARED_COMPONENTS = [
  AutocompleteComponent,
  ChipListComponent
];

const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_COMPONENTS, ...SHARED_MODULES],
})

export class SharedModule {
}
