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
import {Positions} from "../../../shared/interfaces/positions.interface";
import {Router} from "@angular/router";

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
  currentPosition: number;

  constructor(private fb: FormBuilder, private prospectService: ProspectService, private router: Router) {
    this.prospectForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      position: [0, [Validators.required]],
      classification: ['', [Validators.required]],
      state: ['', [Validators.required]],
      school: ['', [Validators.required]],
      video_link: [''],
    });
  }

  ngOnInit(): void {

  }

  submitForm(): void {
    for (const key in this.prospectForm.controls) {
      this.prospectForm.controls[key].markAsDirty();
      this.prospectForm.controls[key].updateValueAndValidity();
    }
    this.prospectService.postAddProspect(this.prospectForm.value).subscribe(
      () => {
        this.router.navigateByUrl(`prospect/view`);
      }
    );
  }

  setPosition(position: Positions) {
    this.prospectForm.get('position').setValue(position.id)
    this.prospectForm.get('position_name').setValue(position.position_name)
    console.log(position.position_name)
    this.prospectForm.updateValueAndValidity()
  }

}
