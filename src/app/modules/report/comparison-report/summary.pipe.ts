import {Pipe, PipeTransform} from '@angular/core';
import {Prospect} from "../../../shared/interfaces/bar-report";
import {ReportService} from "../../../shared/services/report.service";

@Pipe({
  name: 'summary',
  standalone: true
})
export class SummaryPipe implements PipeTransform {

  constructor(private reportService: ReportService) {
  }

  async transform(posId: number, prosId: Prospect, prospectArray: Prospect[]): Promise<string> {
    if (!posId || !prosId?.id || prospectArray.length < 1) {
      return null
    }
    const res = await this.getSummary(posId, prosId.id)

    return res.summary;
  }

  async getSummary(posId: number, prosId: number) {
    return await this.reportService.getSummaryBarReport(posId, prosId).toPromise()
  }
}
