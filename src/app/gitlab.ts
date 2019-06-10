import { Observable } from "rxjs";

export interface Project {
  id: number;
  name: string;
  description: string;
  pipeline: Observable<Pipeline | null>;
}

export interface Pipeline {
  id: number;
  sha: string;
  ref: string;
  status: string;
  web_url: string;
}
