import {
  ComponentFactoryResolver, Injectable, Injector, Inject, EmbeddedViewRef,
  ApplicationRef,
  ComponentRef
} from '@angular/core';
import { SpinnerComponent } from '../../../app/components/shared/spinner/spinner.component';
import { Dom } from './../utils/dom';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private spinner: ComponentRef<SpinnerComponent>;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector) { }

  createComponentRef(component: any): ComponentRef<any> {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  destroyRef(componentRef: ComponentRef<any>, delay = 0): void {
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, delay);
  }

  getDomElementFromComponentRef(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  showSpinner(message = 'Cargando'): void {
    if (!this.spinner) {
      this.spinner = this.createComponentRef(SpinnerComponent);
      Dom.addChild(this.getDomElementFromComponentRef(this.spinner));
    }
    this.spinner.instance.message = message;
  }

  hideSpinner(): void {
    if (this.spinner) {
      this.destroyRef(this.spinner);
      delete this.spinner;
    }
  }

}
