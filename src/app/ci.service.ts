import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Project, Pipeline } from "./gitlab";
import { map, mergeMap, publishReplay, refCount } from "rxjs/operators";

@Injectable()
export class CiService {
  readonly API_TOKEN = 'sample_token';
  readonly API_GITLAB = 'https://gitlab.edina.ac.uk/api/v4';
  readonly API_PROJECTS = this.API_GITLAB + '/groups/39/projects';

  readonly HEADERS = new HttpHeaders({ 'Private-Token': this.API_TOKEN });

  // caches
  private projects$: Observable<Project[]> | null = null;
  private pipelines$: {
    [id: number]: Observable<Pipeline | null>;
  } = {};

  constructor(private http: HttpClient) {}

  projects(): Observable<Project[]> {
    if (!this.projects$) {
      this.projects$ =
        this.http.get<Project[]>(this.API_PROJECTS, {headers: this.HEADERS}).pipe(publishReplay(1), refCount());
    }

    return this.projects$;
  }

  pipelines(): Observable<Pipeline | null> {
    return this.projects().pipe(mergeMap(projects => {
      const ids = projects.map(p => p.id);

      return this.pipeline(ids[0]);
    }));
  }

  pipeline(projectId: number): Observable<Pipeline | null> {
    if (!this.pipelines$[projectId]) {
      this.pipelines$[projectId] =
        this.http.get<Pipeline[]>(`${this.API_GITLAB}/projects/${projectId}/pipelines`, {headers: this.HEADERS})
            .pipe(map(pipelines => pipelines.length ? pipelines[0] : null), publishReplay(1), refCount());
    }

    return this.pipelines$[projectId];
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
