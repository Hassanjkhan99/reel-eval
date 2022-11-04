import {Injectable} from '@angular/core';
import {NzNotificationPlacement, NzNotificationService} from "ng-zorro-antd/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification: NzNotificationService) {
  }

  success(title: string = 'Success', message: string = 'Action successful', placement: NzNotificationPlacement = 'bottomRight', pauseOnHover: boolean = true, duration: number = 2000) {
    this.notification.success(title, message, {
      nzPlacement: placement,
      nzAnimate: true,
      nzPauseOnHover: pauseOnHover,
      nzDuration: duration
    })
  }

  error(title: string = 'Failed', message: string = 'An error occurred', placement: NzNotificationPlacement = 'bottomRight', pauseOnHover: boolean = true, duration: number = 2000) {
    this.notification.error(title, message, {
      nzPlacement: placement,
      nzAnimate: true,
      nzPauseOnHover: pauseOnHover,
      nzDuration: duration
    })
  }

  info(title: string = 'Info', message: string, placement: NzNotificationPlacement = 'bottomRight', pauseOnHover: boolean = true, duration: number = 2000) {
    this.notification.info(title, message, {
      nzPlacement: placement,
      nzAnimate: true,
      nzPauseOnHover: pauseOnHover,
      nzDuration: duration
    })
  }

  warning(title: string = 'Warning', message: string, placement: NzNotificationPlacement = 'bottomRight', pauseOnHover: boolean = true, duration: number = 2000) {
    this.notification.info(title, message, {
      nzPlacement: placement,
      nzAnimate: true,
      nzPauseOnHover: pauseOnHover,
      nzDuration: duration
    })
  }
}
