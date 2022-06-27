import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor() {
  }

  getList(): Observable<string[]> {
    return of([
      'example1',
      'example2',
      'example3',
      'example4',
      'example5'
    ])
  }
}
