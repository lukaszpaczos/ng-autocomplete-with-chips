import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {delay, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {ListService} from './shared/services/list/list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  chipsControl = new FormControl();
  list$: Observable<string[]> = this.chipsControl.valueChanges.pipe(
    startWith(''),
    switchMap((query) => {
      if (typeof query === 'string') {
        return this.listService.getList().pipe(
          delay(500),
          map((response) =>
            response.filter((p) => p.includes(query))
          )
        )
      }

      return of([]);
    })
  );

  chips: string[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private listService: ListService
  ) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {

  }

  onChipsChange(selected: string[]): void {
    this.chips = selected;
  }
}
