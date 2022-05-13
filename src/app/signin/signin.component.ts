import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements AfterViewInit, OnDestroy {
  @ViewChild('passwordField') passwordField?: ElementRef<HTMLInputElement>;

  capsLockMessage: string | undefined;

  readonly sigininForm = new FormGroup({
    emailField: new FormControl('', [Validators.required, Validators.email]),
    passwordField: new FormControl('', [
      Validators.required,
      Validators.min(8),
    ]),
  });

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const eventHandler = (event: KeyboardEvent | MouseEvent) => {
      // if the password field is auto-filled by a password manager,
      // this will also fire a 'keyup' event, but this event will not
      // have the getModifierState method. So we will ignore this!
      if (event?.type === 'keyup' && !(event instanceof KeyboardEvent)) {
        return;
      }
      if (event.getModifierState('CapsLock')) {
        this.capsLockMessage = 'Caps Lock is ON';
      } else {
        this.capsLockMessage = undefined;
      }
      this.cdRef.markForCheck();
    };

    this.passwordField?.nativeElement?.addEventListener('keyup', eventHandler);
    this.passwordField?.nativeElement?.addEventListener(
      'mousedown',
      eventHandler
    );
  }

  ngOnDestroy(): void {
    this.passwordField?.nativeElement?.removeAllListeners?.('keyup');
    this.passwordField?.nativeElement?.removeAllListeners?.('mousedown');
  }
}
