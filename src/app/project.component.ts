import { Component, Input } from "@angular/core";
import { CiModel, Pipeline, Project } from "./gitlab";

@Component({
  selector: 'ci-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() ciModel: CiModel | undefined;

  getProjectTitle(): string {
    if (!this.ciModel) {
      return '';
    }
    return this.ciModel.project.name_with_namespace.replace(/(.*\/ )(.*)/, '$1<strong>$2</strong>');
  }
}
