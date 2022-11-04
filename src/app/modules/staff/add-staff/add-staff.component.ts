import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzInputModule} from "ng-zorro-antd/input";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {StaffService} from "../../../shared/services/staff.service";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {GroupList} from "../../../shared/interfaces/staff.interface";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, NzInputModule, FormsModule, NzIconModule, NzFormModule, ReactiveFormsModule, NzWaveModule, NzButtonModule, NzCardModule, NzCheckboxModule, NzAlertModule, NzSelectModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStaffComponent implements OnInit {
  staffCount: number = 0;
  coachForm: FormGroup;
  options: GroupList[];
  passwordVisible = false;
  passwordVisible2 = false;

  constructor(private fb: FormBuilder, private staffService: StaffService, private router: Router,
              private notification: NotificationService) {
    this.coachForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [this.confirmValidator]],
      groups: [[], [Validators.required]]
    });
  }

  submitForm(): void {

    for (const key in this.coachForm.controls) {
      this.coachForm.controls[key].markAsDirty();
      this.coachForm.controls[key].updateValueAndValidity();
    }
    this.staffService.postAddCoach(this.coachForm.value).subscribe(
      () => {
        this.router.navigateByUrl(`app/staff/view`);
        this.notification.success('Success', 'Your Staff member has been added!')
      }
    );
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.coachForm.controls.password2.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.coachForm.controls.password1.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  ngOnInit(): void {
    this.staffService.getStaff().pipe(map(result => result.count)).subscribe(e => {
      this.staffCount = e;
      if (e >= 20) {
        this.coachForm.disable()
      }
    }, (error) => {
      error = error.error;
      console.log(error)
      for (const errorKey in error) {
        const arr: string[] = error[errorKey];
        arr.forEach((msg) => {
          this.coachForm.get(errorKey).setErrors({msg})

          this.notification.error('Failed', msg)
        });
      }
    })
    this.staffService.getGroupList().subscribe(e => {
      this.options = e;
      console.log(this.options)
    })
  }


}


