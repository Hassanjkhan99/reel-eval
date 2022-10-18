import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {StaffService} from "../../../shared/services/staff.service";

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, NzInputModule, FormsModule, NzIconModule, NzFormModule, ReactiveFormsModule, NzWaveModule, NzButtonModule, NzCardModule, NzCheckboxModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStaffComponent implements OnInit {
  coachForm: FormGroup;
  allChecked = false;
  checkOptionsOne = [
    {label: 'Can create new prospects', value: 'canCreateProspects', checked: false},
    {label: 'Can grade prospects', value: 'canGradeProspects', checked: false},
    {label: 'Can view reports graded by others', value: 'canViewReports', checked: false},
    {label: 'Can view prospects list', value: 'canViewList', checked: true}
  ];

  constructor(private fb: FormBuilder, private staffService: StaffService) {
    this.coachForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [this.confirmValidator]],
      permissions: [0, Validators.required]
    });
  }

  submitForm(value: { first_name: string; last_name: string; username: string; email: string; password1: string; password2: string; }): void {
    for (const key in this.coachForm.controls) {
      this.coachForm.controls[key].markAsDirty();
      this.coachForm.controls[key].updateValueAndValidity();
    }
    this.staffService.postAddCoach(value).subscribe();
    console.log(value);
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.coachForm.controls.confirm.updateValueAndValidity());
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
  }

  updateAllChecked(): void {
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
    } else {
    }
    console.log(this.checkOptionsOne)

  }
}


