import { Component, Input } from "@angular/core";
import { Pipeline, Project } from "./gitlab";

@Component({
  selector: 'ci-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  @Input() project: Project | undefined;
}
