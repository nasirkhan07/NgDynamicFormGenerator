import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[readOnlyInput]'
})

export class ReadOnlyInput
{
    constructor(private _ef: ElementRef){}

    @HostListener("keydown", ['$event'])
    private onKeyPressed($event: KeyboardEvent)
    {
        if(($event.keyCode !== 38) && ($event.keyCode !== 40) && ($event.keyCode !== 13) && ($event.keyCode !== 9) && ($event.keyCode !== 16))
        {
            $event.preventDefault();
        }
    }
}