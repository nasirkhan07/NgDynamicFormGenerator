import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public localState = { value: '' };
  public screenSettings: any[] = [{
    "sortOrder": 1,
    "controlType": "text",
    "label": "Name",
    "defaultValue": "dummy ",
    "validationRules": {
      "maxLength": 10,
      "minLength": null,
      "regexes": []
    }
  }];
  private renderDynamic = true;
  constructor() {

  }

  public createDynamicUi(object: any) {

  }

  public ngOnInit() {

  }

  ngOnDestroy() {
    this.renderDynamic = false;
  }

  public submitState(value: string) {

  }
}
