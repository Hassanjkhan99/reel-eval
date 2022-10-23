import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ProspectService} from "../../../shared/services/prospect.service";
import {NzInputModule} from "ng-zorro-antd/input";

@Component({
  selector: 'app-view-prospect',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, ReactiveFormsModule, NzInputModule],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProspectComponent implements OnInit {
  prospectForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    position_name: new FormControl(''),
    classification: new FormControl(''),
    state: new FormControl(''),
    school: new FormControl(''),
    video_link: new FormControl(''),
    id: new FormControl(0)
  });

  dataSet = [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Smith",
      "position": 1,
      "position_name": "Athlete",
      "classification": "2021",
      "state": "TX",
      "school": "University of Technology",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-johnsmithtxuniversityoftechnology",
      "unique_id_without_club": "johnsmithtxuniversityoftechnology",
      "created": "10-15-2022 18:27:02",
      "modified": "10-16-2022 09:15:12"
    },
    {
      "id": 2,
      "first_name": "Aamir",
      "last_name": "Jamil",
      "position": 1,
      "position_name": "Athlete",
      "classification": "2022",
      "state": "TX",
      "school": "University of Alberta",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-aamirjamiltxuniversityofalberta",
      "unique_id_without_club": "aamirjamiltxuniversityofalberta",
      "created": "10-16-2022 09:10:40",
      "modified": "10-16-2022 09:10:40"
    },
    {
      "id": 3,
      "first_name": "Wick",
      "last_name": "Barry",
      "position": 2,
      "position_name": "Center",
      "classification": "2021",
      "state": "TX",
      "school": "University of Texas",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-wickbarrytxuniversityoftexas",
      "unique_id_without_club": "wickbarrytxuniversityoftexas",
      "created": "10-16-2022 09:32:15",
      "modified": "10-18-2022 17:47:08"
    },
    {
      "id": 4,
      "first_name": "Wick",
      "last_name": "Barry",
      "position": 2,
      "position_name": "Center",
      "classification": "2021",
      "state": "TX",
      "school": "University of Tec",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-wickbarrytxuniversityoftec",
      "unique_id_without_club": "wickbarrytxuniversityoftec",
      "created": "10-18-2022 19:33:13",
      "modified": "10-18-2022 19:33:13"
    },
    {
      "id": 5,
      "first_name": "John",
      "last_name": "Bar",
      "position": 2,
      "position_name": "Center",
      "classification": "2021",
      "state": "TX",
      "school": "University of Tec",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-johnbartxuniversityoftec",
      "unique_id_without_club": "johnbartxuniversityoftec",
      "created": "10-19-2022 22:24:56",
      "modified": "10-19-2022 22:28:24"
    },
    {
      "id": 6,
      "first_name": "John",
      "last_name": "Wick",
      "position": 3,
      "position_name": "Cornerback",
      "classification": "2021",
      "state": "TX",
      "school": "University of Tec",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-johnwicktxuniversityoftec",
      "unique_id_without_club": "johnwicktxuniversityoftec",
      "created": "10-19-2022 22:25:11",
      "modified": "10-19-2022 22:25:11"
    },
    {
      "id": 7,
      "first_name": "Erick",
      "last_name": "Teddy",
      "position": 2,
      "position_name": "Center",
      "classification": "2021",
      "state": "TX",
      "school": "University of Texas",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-erickteddytxuniversityoftexas",
      "unique_id_without_club": "erickteddytxuniversityoftexas",
      "created": "10-19-2022 22:25:29",
      "modified": "10-19-2022 22:25:29"
    },
    {
      "id": 8,
      "first_name": "Baren",
      "last_name": "Barry",
      "position": 2,
      "position_name": "Center",
      "classification": "2019",
      "state": "UN",
      "school": "High School Texas",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-barenbarryunhighschooltexas",
      "unique_id_without_club": "barenbarryunhighschooltexas",
      "created": "10-19-2022 22:26:01",
      "modified": "10-19-2022 22:26:01"
    },
    {
      "id": 9,
      "first_name": "Johnny",
      "last_name": "Baren",
      "position": 10,
      "position_name": "Long Snapper",
      "classification": "2022",
      "state": "TX",
      "school": "University of Texas",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-johnnybarentxuniversityoftexas",
      "unique_id_without_club": "johnnybarentxuniversityoftexas",
      "created": "10-19-2022 22:26:28",
      "modified": "10-19-2022 22:26:28"
    },
    {
      "id": 10,
      "first_name": "Aaron",
      "last_name": "Cartier",
      "position": 8,
      "position_name": "Inside Backer",
      "classification": "2011",
      "state": "TX",
      "school": "High School Dallas",
      "video_link": "",
      "club": 4,
      "user": 6,
      "club_name": "University of Dallas",
      "archived": false,
      "unique_id": "universityofdallas-aaroncartiertxhighschooldallas",
      "unique_id_without_club": "aaroncartiertxhighschooldallas",
      "created": "10-19-2022 22:27:35",
      "modified": "10-19-2022 22:27:35"
    }
  ]


  currentEditIndex: number;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getProspect();
  }

  isEdit(i: number) {
    console.log(this.dataSet[i]);
    this.currentEditIndex = i;
    this.prospectForm.setValue({
      first_name: this.dataSet[i].first_name,
      last_name: this.dataSet[i].last_name,
      position_name: this.dataSet[i].position_name,
      classification: this.dataSet[i].classification,
      state: this.dataSet[i].state,
      school: this.dataSet[i].school,
      video_link: this.dataSet[i].video_link,
      id: this.dataSet[1].id
    })
  }

  isSave(i: number) {
    console.log(this.prospectForm.value);
    this.dataSet[i] = {
      ...this.dataSet[i],
      ...this.prospectForm.value,
    }
    this.currentEditIndex = -1;
    console.log(this.dataSet[i])
    console.log({
      ...this.dataSet[i],
      ...this.prospectForm.value,
    })
    this.cdr.detectChanges();
  }

  getProspect() {
    this.prospectSer.getProspects().subscribe(
      x => {
        console.log(x);
      }
    )
  }
}
