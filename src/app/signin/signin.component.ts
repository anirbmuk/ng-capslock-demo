import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, fromEvent, map, of, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('passwordField') passwordField?: ElementRef<HTMLInputElement>;

  capsLockMessage: string | undefined;
  private documentVisibleSub?: Subscription;

  readonly sigininForm = new FormGroup({
    emailField: new FormControl('', [Validators.required, Validators.email]),
    passwordField: new FormControl('', [
      Validators.required,
      Validators.min(8),
    ]),
  });

  readonly documentVisible$ = isPlatformBrowser(this.platformId as Object)
    ? fromEvent(this.document, 'visibilitychange').pipe(
        map(() => this.document.visibilityState),
        filter((value) => value === 'visible')
      )
    : of('visible');

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: unknown
  ) {}

  ngOnInit(): void {
    this.documentVisibleSub = this.documentVisible$.subscribe(() => {
      this.passwordField?.nativeElement?.focus?.();
      this.passwordField?.nativeElement?.dispatchEvent(
        new KeyboardEvent('keyup')
      );
    });
    this.cdRef.markForCheck();
  }

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
    this.documentVisibleSub?.unsubscribe();
  }
}
