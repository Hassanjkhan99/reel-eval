import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {ProspectService} from "../../../shared/services/prospect.service";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSelectModule} from "ng-zorro-antd/select";
import {PositionsSelectComponent} from "../../../shared/components/positions-select/positions-select.component";

@Component({
  selector: 'app-add-prospect',
  standalone: true,
  imports: [CommonModule, NzGridModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, FormsModule, PositionsSelectComponent],
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProspectComponent implements OnInit {
  prospectForm: FormGroup;
  selectedValue = null;

  constructor(private fb: FormBuilder, private prospectService: ProspectService) {
    this.prospectForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      position: [0, [Validators.required, Validators.maxLength(2)]],
      classification: ['', [Validators.required]],
      state: ['', [Validators.required]],
      school: ['', [Validators.required]],
      video_link: [''],
    });
  }

  ngOnInit(): void {

  }

  submitForm(value: {
    first_name: string; last_name: string; position: number; classification: string; state: string;
    school: string; video_link: string;
  }): void {
    for (const key in this.prospectForm.controls) {
      this.prospectForm.controls[key].markAsDirty();
      this.prospectForm.controls[key].updateValueAndValidity();
    }
    this.prospectService.postAddProspect(value).subscribe();
    console.log(value);
  }


}
