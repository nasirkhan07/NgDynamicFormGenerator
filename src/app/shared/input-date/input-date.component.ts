import { Component, OnInit, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Month } from '../enums';
import { SharedService as CommonService } from '../shared.service';

const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDateComponent),
    multi: true
};
@Component({
    selector: 'input-date',
    templateUrl: './input-date.component.html',
    providers: [SELECT_VALUE_ACCESSOR]
})
export class InputDateComponent implements OnInit, ControlValueAccessor {

    public isMonthSelected: boolean = false;
    public isDateSelected: boolean = false;
    public isYearSelected: boolean = false;

    public years: number[] = [];
    public months: { key: number, value: string }[] = [];
    public dates: number[] = [];

    public selectedDate: number = 0;
    public selectedMonth: number = 0;
    public selectedYear: number = 0;
    public controlName: any;

    public source: string;
    private onTouched = () => { };
    private onChange: (value: string) => void = () => { };

    constructor(public commonService: CommonService, public el: ElementRef) {
        this.source = el.nativeElement.getAttribute("source");
        this.controlName = el.nativeElement.getAttribute("controlName");
    }
    currDate: string = null;
    ngOnInit() {
        this.dates = [];
        for (let i = 0; i < 31; i++) {
            this.dates.push(i + 1);
        }
        this.selectedDate = this.dates[0];
        this.initializeMonth();
        this.selectedMonth = this.months[0].key;
        this.initializeYear();
        this.selectedYear = this.years[0];
        this.currDate = this.selectedMonth + "/" + this.selectedDate + "/" + this.selectedYear;
    }

    public initializeMonth() {
        this.months = [];
        for (let i = 0; i < 12; i++) {
            this.months.push({ key: i + 1, value: Month[i] });
        }
    }

    public initializeYear() {
        let maxYear = new Date().getFullYear();
        this.years = [];
        for (let i = maxYear - 150; i <= maxYear; i++) {
            this.years.push(i);
        }
    }

    public onChangeDate(ev) {
        this.isDateSelected = true;
        let value = ev.target.value;
        this.selectedDate = value;
        if(this.selectedDate > 28)
        {
            // if (this.selectedMonth != 1) {
            //     this.changeMonth();
            // }
            if ((this.selectedMonth == 2) && (this.selectedDate == 29)) {
                this.changeYear();
            }
            else if ((this.selectedMonth != 0) || (this.selectedDate != 0)) {
                this.initializeYear();
            }
        }
        let myDate: string = this.selectedMonth + "/" + this.selectedDate + "/" + this.selectedYear;
            this.onChange(myDate);

    }

    public onChangeMonth(ev) {
        this.isMonthSelected = true;
        let value = ev.target.value;
        this.selectedMonth = value;
        if (value == 2) {
            if (this.dates[this.dates.length - 1] == 31) {
                this.dates.pop();
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 30) {
                this.dates.pop();
            }
            if(this.isYearSelected)
            {
                if(!isLeapYear(this.selectedYear))
                {
                    if (this.dates[this.dates.length - 1] > 30) {
                        this.dates.pop();
                        this.dates.pop();
                        this.dates.pop();
                    }
                    else if (this.dates[this.dates.length - 1] == 30) {
                        this.dates.pop();
                        this.dates.pop();
                    }
                    else if (this.dates[this.dates.length - 1] == 29) {
                        this.dates.pop();
                    }
                }
            }
        }
        else if ((value == 4) || (value == 6) || (value == 9) || (value == 11)) {
            if (this.dates[this.dates.length - 1] == 31) {
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 29) {
                this.dates.push(30);
            }
            else if (this.dates[this.dates.length - 1] == 28) {
                this.dates.push(29);
                this.dates.push(30);
            }
        }
        else {
            if (this.dates[this.dates.length - 1] == 29) {
                this.dates.push(30);
                this.dates.push(31);
            }
            else if (this.dates[this.dates.length - 1] == 30) {
                this.dates.push(31);
            }
            else if (this.dates[this.dates.length - 1] == 28) {
                this.dates.push(29);
                this.dates.push(30);
                this.dates.push(31);
            }
        }
        if ((this.selectedMonth == 2) && (this.selectedDate == 29)) {
            this.changeYear();
        }
        else if ((this.selectedMonth != 1) || (this.selectedDate != 1)) {
            this.initializeYear();
        }
        let myDate: string = this.selectedMonth + "/" + this.selectedDate + "/" + this.selectedYear;
        this.onChange(myDate);
    }

    public onChangeYear(ev) {
        this.isYearSelected = true;
        let value = ev.target.value;
        this.selectedYear = value;
        if ((this.selectedDate != 0) && (this.selectedMonth == 2)) {
            this.changeDate();
        }
        let myDate: string = this.selectedMonth + "/" + this.selectedDate + "/" + this.selectedYear;
        this.onChange(myDate);
    }

    public changeDate() {
        if(isLeapYear(this.selectedYear))
        {
            if (this.dates[this.dates.length - 1] > 30) {
                this.dates.pop();
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 30) {
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 28) {
                this.dates.push(29);
            }
        }
        else {
            if (this.dates[this.dates.length - 1] > 30) {
                this.dates.pop();
                this.dates.pop();
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 30) {
                this.dates.pop();
                this.dates.pop();
            }
            else if (this.dates[this.dates.length - 1] == 29) {
                this.dates.pop();
            }
        }
    }

    public changeMonth() {
        if (this.selectedDate > 30) {
            this.months = [];
            this.months.push({ key: 1, value: Month[0] });
            this.months.push({ key: 3, value: Month[2] });
            this.months.push({ key: 5, value: Month[4] });
            this.months.push({ key: 7, value: Month[6] });
            this.months.push({ key: 8, value: Month[7] });
            this.months.push({ key: 10, value: Month[9] });
            this.months.push({ key: 12, value: Month[11] });
        }
        else if (this.selectedDate == 30) {
            this.initializeMonth();
            this.months.splice(1, 1);
        }
        else {
            this.initializeMonth();
        }
    }

    public changeYear() {
        let tempYears: number[] = [];
        for (let i = 0; i < this.years.length; i++) {
            if (isLeapYear(this.years[i]))
            {
                tempYears.push(this.years[i]);
            }
        }
        this.years = tempYears;
    }

    writeValue(obj: any) {
        this.onChange(obj);
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
        this.onChange(this.currDate);
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

}

function isLeapYear(year): boolean
{
    if (year % 4 == 0) {
        if(year % 100 == 0)
        {
            if(year % 400 == 0)
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    }
    return false;
}