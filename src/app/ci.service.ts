import { Injectable, } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { concat, Observable, of } from "rxjs";
import { Project, Pipeline, Commit } from "./gitlab";
import { map, publishReplay, reduce, refCount } from "rxjs/operators";
import { SettingsService } from './settings.service';

@Injectable()
export class CiService {
  private readonly API_URL = '/api/v4';
  private readonly API_PROJECTS_URL = '/groups/:id/projects?per_page=100';
  private url = '';
  private groupIds: number[] = [];
  private tokenHeader = new HttpHeaders();

  // caches
  private pipelines$: {
    [id: number]: Observable<Pipeline | undefined>;
  } = {};

  constructor(private http: HttpClient, settingsService: SettingsService) {
    settingsService.settings$.subscribe(s => {
      this.url = s.url + this.API_URL;
      this.tokenHeader = this.tokenHeader.set('Private-Token', s.key);
      this.groupIds = s.groupIds.split(',').map(g => parseInt(g, 10));
    });
  }

  projects(): Observable<Project[]> {
    if (!this.url || !this.groupIds.length || !this.tokenHeader.get('Private-Token')) {
      return of([]);
    }

    const projects = this.groupIds.map(id => {
      const url = this.url + this.API_PROJECTS_URL.replace(':id', id.toString());
      return this.http.get<Project[]>(url, {headers: this.tokenHeader});
    });
    return concat(...projects).pipe(reduce<Project[]>((a, v) => {
      a.push(...v);
      return a;
    }, []), publishReplay(1), refCount());
  }

  pipeline(projectId: number): Observable<Pipeline | undefined> {
    if (!this.pipelines$[projectId]) {
      this.pipelines$[projectId] =
        this.http.get<Pipeline[]>(`${this.url}/projects/${projectId}/pipelines`, {headers: this.tokenHeader})
            .pipe(map(pipelines => pipelines.find(p => p.ref === 'master')), publishReplay(1), refCount());
    }

    return this.pipelines$[projectId];
  }

  commit(projectId: number, commit: string): Observable<Commit | undefined> {
    return this.http.get<Commit>(`${this.url}/projects/${projectId}/repository/commits/${commit}`,
      {headers: this.tokenHeader});
  }
}
