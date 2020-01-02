import { Component, OnInit } from '@angular/core';
import { CiService } from "./ci.service";
import { CiModel } from "./gitlab";
import { SettingsService } from './settings.service';

@Component({
  selector: 'ci-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  title = 'ci-dash';

  ciModels: CiModel[] = [];

  constructor(private ci: CiService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe(() => this.updateProjects());
  }

  private updateProjects() {
    this.ci.projects().subscribe(projects => {
      this.ciModels = projects.map(p => { return { project: p } as CiModel; });
      this.ciModels.sort((a, b) => a.project.name.localeCompare(b.project.name));

      this.ciModels.forEach(ciModel => {
        ciModel.pipeline$ = this.ci.pipeline(ciModel.project.id);

        ciModel.pipeline$.subscribe(p => {
          if (!p) {
            return;
          }
          ciModel.commit$ = this.ci.commit(ciModel.project.id, p.sha);
        });
      })
    });
  }
}
