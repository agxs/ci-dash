import { Component, Input } from "@angular/core";
import { Pipeline, Project } from "./gitlab";

@Component({
  selector: 'ci-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() project: Project | undefined;

  getProjectTitle(): string {
    if (!this.project) {
      return '';
    }
    return this.project.name_with_namespace.replace(/(.*\/ )(.*)/, '$1<strong>$2</strong>');
  }
}
