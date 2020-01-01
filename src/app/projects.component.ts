import { Component, OnInit } from '@angular/core';
import { CiService } from "./ci.service";
import { Project } from "./gitlab";

@Component({
  selector: 'ci-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  title = 'ci-dash';

  projects: Project[] = [];

  constructor(private ci: CiService) {}

  ngOnInit(): void {
    this.ci.projects().subscribe(projects => {
      this.projects = projects;
      this.projects.sort((a, b) => a.name.localeCompare(b.name));

      projects.forEach(project => {
        project.pipeline$ = this.ci.pipeline(project.id);

        project.pipeline$.subscribe(p => {
          if (!p) {
            return;
          }
          project.commit$ = this.ci.commit(project.id, p.sha);
        });
      })
    });
  }
}