/*
 * Angular 2 decorators and services
 */
import {
  NgModule, ComponentFactory, ComponentRef, Compiler,
  Component, ViewChild,
  ViewEncapsulation, ViewContainerRef,
  Input,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators, FormControl } from '@angular/forms';
 // import { Compiler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../common.service';
import { settings } from '../data/data';
import { DynamicBase } from '../data/dynamic-base';
import { Http } from '@angular/http';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'dynamic',
  template: `
    <div #dynamiccomponent></div>
  `
})

export class DynamicComponent extends DynamicBase implements OnInit {
  constructor(public commonService: CommonService, private componentFactoryResolver: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef,  private compiler: Compiler) {
    super();
  }
   // private compiler: Compiler = new Compiler();
  @ViewChild('dynamiccomponent', { read: ViewContainerRef })
  dynamicComponentTarget: ViewContainerRef;

  @Input() screenobj = settings;
  @Input('component-name') compName = null;
  @Input('col-layout') colLayout = 4;

  protected componentRef: ComponentRef<{ val: any }>;
  template;

  ngOnInit() {
    if (this.screenobj) {
      this.screenobj = this.screenobj.sort((first, second) => first.sortOrder - second.sortOrder);
      const uniqueObj = [];
      const temp = [];
      for (const item of this.screenobj) {
        if (temp.indexOf(item.label) < 0) {
          uniqueObj.push(item);
        }
        temp.push(item.label);
      }
      this.template = super.createHtmlTemplate.call(this, uniqueObj);
      const comp = this.getDynamicComponent(this.template, this.screenobj);
      const module = this.getDynamicModule(comp);

      // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(comp);
      // this.viewContainerRef.clear();
      // const componentRef = this.viewContainerRef.createComponent(componentFactory);

      this.compiler.compileModuleAndAllComponentsAsync(module).then((moduleWithFactories) => {
        const factory: ComponentFactory<{ val: any }> = <ComponentFactory<{ val: any }>>(
          moduleWithFactories.componentFactories.find(a => a.componentType === comp));
        this.componentRef = this
          .dynamicComponentTarget
          .createComponent(factory);
        const component = this.componentRef.instance;
      });
    }
  }

  public getDynamicComponent(template: string, screenObj) {
    @Component({ template: template }) class DummyComponent extends DynamicBase {
      cform: FormGroup;
      tooltips = {};
      formName = 'cform';
      formObj = null;
      depenCtrlMap = {};
      createFormObj() {
        this.formObj = super.populateFormObject.call(this, Object.create(screenObj));
        for (const ctrl in this.formObj) {
          if (this.formObj[ctrl].constructor.toString().indexOf('Object') > 0) {
            this.formObj[ctrl] = this.createNestedFormObject(this.formObj[ctrl]);
          }
        }
      }

      constructor(private fb: FormBuilder, public commonService: CommonService) {
        super(commonService, 'cform');
        this.createFormObj();
        this.screenobj = screenObj;
        super.createSelectSources.call(this);

        Object.assign(this.tooltips, super.createValidationMessagesObject(this.formObj));
        this[this.formName] = this.fb.group(this.formObj);

        this[this.formName].valueChanges
        // .debounceTime(500)
        // .distinctUntilChanged()
        .subscribe(val => {
          // tslint:disable-next-line:forin
          for (const key in this.depenCtrlMap) {
            this[this.formName].controls[key].updateValueAndValidity({ emitEvent: true, onlySelf: true });
            if (this[this.formName].controls[key].invalid) {
              super.manageFormState.call(this, val);
            }
          }

          super.manageFormState.call(this, val);

          console.log(this);
        });

        (<Array<any>>this.screenobj).forEach(item => {
          if (item.controlType === 'select') {
            if (typeof item.options === 'string') {
              this.commonService.httpGet(item.options).subscribe(val => {
                this[item.controlName.toLowerCase() + 'Source'] = val.json();
                this[this.formName].controls[item.controlName].reset('null');
              });
            }
          } else if (item.controlType === 'radio') {
            if (typeof item.options === 'string') {
              this.commonService.httpGet(item.options).subscribe(val => {
                this[item.controlName.toLowerCase() + 'Source'] = val.json();
                this[this.formName].controls[item.controlName].reset('null');
              });
            }
          }
        });
        super.manageFormState.call(this);
      }

      public submitThis(api, method, el) {
        el.preventDefault();
        this.commonService.httpPost(api, this[this.formName].value);
        console.log(this[this.formName].value);
      }

      ngOnDestroy() {
        console.log(this);
      }
    }
    return DummyComponent;
  }

}
