import { Component, OnInit } from '@angular/core';
import { CiService } from "./ci.service";
import { Project } from "./gitlab";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ci-dash';

  projects: Project[] = [];

  constructor(private ci: CiService) {}

  ngOnInit(): void {
    this.ci.projects().subscribe(projects => {
      this.projects = projects;
      this.projects.sort((a, b) => a.name.localeCompare(b.name));

      projects.forEach(project => {
        project.pipeline = this.ci.pipeline(project.id);
      })
    });
  }
}
