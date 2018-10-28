import { Component, OnInit, Input, Output, ViewChild, forwardRef, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {SharedService as CommonService } from '../shared.service';

const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
};

@Component({
    selector: 'select-list',
    templateUrl: './select.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [SELECT_VALUE_ACCESSOR]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

    public source: string;
    private onTouched = () => { };
    private onChange: (value: string) => void = () => { };

    private selectValue: string;
    public controlName: any;
    public selectSource: any = null;
    private dropdownFlag: boolean = true;
    private selectHover: number = -1;
    private scrollPos: number = 0;
    private element: any;

    constructor(public commonService: CommonService, public el: ElementRef) {
        this.source = el.nativeElement.getAttribute("source");
        this.controlName = el.nativeElement.getAttribute("controlName");
    }

    ngOnInit() {
        this.commonService.httpGet(this.source).subscribe(val => {
            this.selectSource = val.json();
        });
        this.hideDropdown = this.hideDropdown.bind(this);
    }

    public writeValue(obj: any): void {
        this.inputVal = obj;
        this.onChange(obj);
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    @ViewChild("dropBox")
    private dropBox: any;

    private inputVal: string = "";
    private focusedInput: any;

    public showDropdown(currentObj) {
        this.focusedInput = currentObj;
        let elem = this.dropBox;
        if (this.dropdownFlag === true) {
            elem.nativeElement.classList.remove('decrease-scale');
            this.dropdownFlag = false;
        }
    }

    public hideDropdown() {
        let elem = this.dropBox;
        elem.nativeElement.classList.add('decrease-scale');
        this.dropdownFlag = true;
        this.selectHover = -1;
        this.dropBox.nativeElement.scrollTop = 0;
    }

    public selectItem(item) {
        this.inputVal = item.value;
        this.onChange(item.value);
        setTimeout(() => { this.dropBox.nativeElement.classList.add('decrease-scale') }, 300);
        this.dropdownFlag = true;
    }

    public checkContent(currentObj) {
        if (this.selectHover >= 0) {
            this.element[this.selectHover].classList.remove("on-mouse-over");
        }
        let label = currentObj.target.parentElement.getElementsByTagName('label');
        if ((null != currentObj.target.value) && (undefined != currentObj.target.value) && ('' != currentObj.target.value)) {
            currentObj.target.parentElement.getElementsByTagName('label')[0].classList.add('label-active');
        }
        else {
            currentObj.target.parentElement.getElementsByTagName('label')[0].classList.remove('label-active');
        }
        setTimeout(() => { this.hideDropdown() }, 300);
    }

    public keyFunction(el) {
        if (!this.element) {
            this.element = this.dropBox.nativeElement.children[0].children;
        }
        if (el.keyCode === 38) {
            console.log("key up");
            if (this.selectHover > 0) {
                if (this.selectHover > 0)
                    this.element[this.selectHover].classList.remove("on-mouse-over");
                this.selectHover--;
                // if()
                // {
                //     if (this.scrollPos > 0)
                //         this.scrollPos--;
                //     this.dropBox.nativeElement.scrollTop = this.scrollPos * 50;
                // }
                this.element[this.selectHover].classList.add("on-mouse-over");
            }
        }
        else if (el.keyCode === 40) {
            console.log("key down" + this.element[0].clientHeight);
            if (this.selectHover < this.element.length - 1) {
                if (this.selectHover > -1)
                    this.element[this.selectHover].classList.remove("on-mouse-over");
                this.selectHover++;
                if (this.element[this.selectHover].offsetTop - this.dropBox.nativeElement.offsetTop - this.dropBox.nativeElement.clientHeight > 0) {
                    this.scrollPos++;
                    this.dropBox.nativeElement.scrollTop = this.scrollPos * 50;
                }
                this.element[this.selectHover].classList.add("on-mouse-over");
            }
        }
        else if (el.keyCode === 13) {
            this.selectItem({ value: this.element[this.selectHover].innerText });
            this.element[this.selectHover].classList.remove("on-mouse-over");
            this.selectHover = -1;
            this.dropBox.nativeElement.scrollTop = 0;
        }
    }
}