import { Observable } from "rxjs";

export interface Project {
  id: number;
  name: string;
  description: string;
  pipeline$: Observable<Pipeline | undefined>;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: Date;
  default_branch: string;
  tag_list: string[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string | null;
  avatar_url: string | null;
  last_activity_at: Date;
}

export interface Pipeline {
  id: number;
  sha: string;
  ref: string;
  status: string;
  web_url: string;
}
