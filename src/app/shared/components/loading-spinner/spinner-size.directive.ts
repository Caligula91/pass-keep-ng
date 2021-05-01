import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSpinnerSize]'
})
export class SpinnerSizeDirective implements OnInit {

  @Input('appSpinnerSize') spinnerSize!: { size: string };

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const spinner = (this.el.nativeElement as HTMLDivElement).firstElementChild as HTMLDivElement;
    if (spinner) {
      spinner.style.width = this.spinnerSize.size;
      spinner.style.height = this.spinnerSize.size;
    }
  }

}
