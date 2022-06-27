import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter, HostListener,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {debounceTime, noop} from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @ViewChild('autocomplete', { static: false }) elementRef: ElementRef = new ElementRef('');

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @Input() options: string[] | null = [];

  @Output() onSelect = new EventEmitter<string[]>();

  inputControl: FormControl = new FormControl();
  isOpen: boolean = false;
  chips: string[] = [];
  hoverOptionIndex = -1;
  isSearching = false;
  noResults = false;

  constructor(
    @Optional() @Self() private _controlDir: NgControl,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    if (this._controlDir) {
      this._controlDir.valueAccessor = this
    }
  }

  ngOnInit(): void {

  }

  writeValue(query: string): void {
    query && this.inputControl.setValue(query);

    this._changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (query: string) => void): void {
    this.inputControl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        this.hoverOptionIndex = -1;

        if (typeof value === 'string') {
          if (value.length) {
            this.isSearching = true;
            this._changeDetectorRef.detectChanges();

            fn(value)
          } else {
            this.isSearching = false;
            this.noResults = false;

            fn('')
          }
        } else {
          fn(value)
        }
      },
    })
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
  }

  onTouched(): void {

  }

  onAddChip(option: string): void {
    this.chips.push(option);
    this.chips = [...new Set(this.chips)];

    this.inputControl.setValue('');
    this.close();
    this.onSelect.emit(this.chips);
  }

  onRemoveChip(options: string[]): void {
    this.chips = options;

    this.inputControl.setValue('');
    this.close();
    this.onSelect.emit(this.chips);
  }

  onMouseHover(index: number): void {
    this.hoverOptionIndex = index;
  }

  onKeyPressed(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this._keyPressedArrowDown();
        break;

      case 'ArrowUp':
        this._keyPressedArrowUp()
        break;

      case 'Enter':
        this._keyPressedEnter()
        break;

      case 'Escape':
        this._keyPressedEsc();
        break
    }
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.hoverOptionIndex = -1;
  }

  private _keyPressedArrowUp(): void {
    if (this.hoverOptionIndex <= 0) {
      this.hoverOptionIndex = (this.options?.length || 1) - 1;
    } else {
      this.hoverOptionIndex--;
    }
  }

  private _keyPressedArrowDown(): void {
    if (this.hoverOptionIndex < (this.options?.length || 1) - 1) {
      this.hoverOptionIndex++;
    } else {
      this.hoverOptionIndex = 0;
    }
  }

  private _keyPressedEnter(): void {
    if (this.options && this.options[this.hoverOptionIndex]) {
      this.onAddChip(this.options[this.hoverOptionIndex]);
      this.open();
    }
  }

  private _keyPressedEsc(): void {
    this.close();
  }
}
