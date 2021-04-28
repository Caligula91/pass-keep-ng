import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

/**
 * PUT DIRECTIVE ON IMG ELEMENT AND PASS REF OF INPUT ELEMENT
 */

@Directive({
  selector: '[appPasswordVisibility]'
})
export class PasswordVisibilityDirective implements OnInit {

  @Input('appPasswordVisibility') inputElement!: HTMLInputElement;

  @HostListener('click') onClick() {
    this.togglePasswordVisibility(this.inputElement, this.el.nativeElement);
  }

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    (this.el.nativeElement as HTMLImageElement).src = '/assets/hide-password.png';
    this.inputElement.type = 'password';
  }

  private togglePasswordVisibility(input: HTMLInputElement ,image: HTMLImageElement): void {
    input.type = (this.inputElement.type === 'text') ? 'password' : 'text';
    image.src = (input.type === 'text') ? '/assets/show-password.png' : '/assets/hide-password.png';
  }

}
