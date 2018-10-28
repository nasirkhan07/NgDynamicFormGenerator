import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '.ripplelink'
})

export class RippleLink
{
    private _el: HTMLElement;

    constructor(_nativeEl: ElementRef){
        this._el = _nativeEl.nativeElement as HTMLElement;
    }

    @HostListener('mousedown', ['$event'])
    private rippleEffect($event: MouseEvent)
    {
        let oldChild = this._el.querySelector('span.ink')
        if(oldChild)
        {
            this._el.removeChild(oldChild);
        }
        let inkSpan = document.createElement('span');
        inkSpan.classList.add('ink');
        this._el.appendChild(inkSpan);

        inkSpan.classList.remove('animate');
        if (!inkSpan.clientHeight && !inkSpan.clientWidth) {
            let d = Math.max(this.offsetWidth(this._el), this.offsetHeight(this._el));
            inkSpan.style.width = d + 'px';
            inkSpan.style.height = d + 'px';
        }

        let x = $event.pageX - this.offset(this._el).left - inkSpan.clientWidth / 2;
        let y = $event.pageY - this.offset(this._el).top - inkSpan.clientHeight / 2;
        inkSpan.style.left = x + 'px';
        inkSpan.style.top = y + 'px';
        inkSpan.classList.add('animate');
    }

    public offsetHeight(elm): number {
        let elmHeight, elmMargin;
        elmHeight = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
        elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
        return (elmHeight+elmMargin);
    }

    public offsetWidth(elm): number {
        let elmWidth, elmMargin;
        elmWidth = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('width'));
        elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-left')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-right'));
        return (elmWidth+elmMargin);
    }

    offset(elem): {top: number, left: number} {
        if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		let rect = elem.getBoundingClientRect();

		let
            doc = elem.ownerDocument,
		    docElem = doc.documentElement,
		    win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
    }
}