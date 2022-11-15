import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ProspectService} from "../../services/prospect.service";
import {Schools} from "../../interfaces/school.interface";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-school-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './school-select.component.html',
  styleUrls: ['./school-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolSelectComponent implements OnInit {

  schools: any[] = []
  school: FormControl = new FormControl<string>('')

  @Input() selectedSchool: string;
  @Output() schoolChanged: EventEmitter<Schools> = new EventEmitter<Schools>()

  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.prospectService.getSchools().subscribe(schools => {
      this.schools = schools.map(e => {
        return {
          id: e.id.toString(), school_name: e.school_name, state_name: e.state_name
        }
      })
      this.setValue();
      this.cdr.detectChanges()
    })
    this.school.valueChanges.subscribe(e => {
      this.emitSchool(e)
    })
  }


  emitSchool(school_name) {
    console.log(this.schools.find(e => e.school_name == school_name))
    if (!this.schools.includes(this.selectedSchool.toString())) {
      return
    }
    this.schoolChanged.emit(this.schools.find(e => e.school_name == school_name))
  }

  setValue() {
    if (!this.selectedSchool) return
    if (!this.schools.includes(this.selectedSchool.toString())) {
      return
    }
    this.school.setValue(this.selectedSchool.toString() ?? '1');
  }

}
