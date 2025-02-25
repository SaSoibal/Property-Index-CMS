import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';

@Directive({
    selector: '[appDebounceChange]'
})
export class DebounceChangeDirective implements OnInit {

    @Input() debounceTime: number = 500;
    @Output() ngModelDebounceChange = new EventEmitter<any>();
    private subscription: Subscription = new Subscription();

    constructor (
        private ngModel: NgModel
    ) { }

    ngOnInit(): void {
        this.subscription = this.ngModel.valueChanges
            ?.pipe(debounceTime(this.debounceTime))
            .subscribe(value => this.ngModelDebounceChange.emit(value));
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
