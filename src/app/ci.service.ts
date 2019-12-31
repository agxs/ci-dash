import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { concat, Observable } from "rxjs";
import { Project, Pipeline, Commit } from "./gitlab";
import { map, mergeMap, publishReplay, reduce, refCount } from "rxjs/operators";

@Injectable()
export class CiService {
  readonly API_TOKEN = 'sample_token';
  readonly API_GITLAB = 'https://gitlab.edina.ac.uk/api/v4';
  readonly API_PROJECTS = this.API_GITLAB + '/groups/:id/projects';
  readonly API_PROJECT_IDS = [39, 70];

  readonly HEADERS = new HttpHeaders({ 'Private-Token': this.API_TOKEN });

  // caches
  private projects$: Observable<Project[]> | undefined = undefined;
  private pipelines$: {
    [id: number]: Observable<Pipeline | undefined>;
  } = {};

  constructor(private http: HttpClient) {}

  projects(): Observable<Project[]> {
    if (!this.projects$) {
      const projects = this.API_PROJECT_IDS.map(id => {
        const url = this.API_PROJECTS.replace(':id', id.toString());
        return this.http.get<Project[]>(url, {headers: this.HEADERS})
      });
      this.projects$ = concat(...projects).pipe(reduce<Project[]>((a, v) => {
        a.push(...v);
        return a;
      }, []), publishReplay(1), refCount());
    }

    return this.projects$;
  }

  pipelines(): Observable<Pipeline | undefined> {
    return this.projects().pipe(mergeMap(projects => {
      const ids = projects.map(p => p.id);

      return this.pipeline(ids[0]);
    }));
  }

  pipeline(projectId: number): Observable<Pipeline | undefined> {
    if (!this.pipelines$[projectId]) {
      this.pipelines$[projectId] =
        this.http.get<Pipeline[]>(`${this.API_GITLAB}/projects/${projectId}/pipelines`, {headers: this.HEADERS})
            .pipe(map(pipelines => pipelines.find(p => p.ref === 'master')), publishReplay(1), refCount());
    }

    return this.pipelines$[projectId];
  }

  commit(projectId: number, commit: string): Observable<Commit | undefined> {
    return this.http.get<Commit>(`${this.API_GITLAB}/projects/${projectId}/repository/commits/${commit}`,
      {headers: this.HEADERS});
  }

//  async projects() {
//    const api = new Gitlab({
//      host: 'https://gitlab.edina.ac.uk',
//      token: 'sample_token'
//    });
//    const digimapGroup = await api.Groups.show(39);
//    console.log(digimapGroup);
//    return digimapGroup;
//  }
}
