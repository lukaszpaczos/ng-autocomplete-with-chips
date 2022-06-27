import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent implements OnInit {
  @Input() chips: string[] = [];

  @Output() onRemove = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onRemoveChip(chip: string): void {
    this.onRemove.emit(this.chips.filter((c) => c !== chip));
  }
}
