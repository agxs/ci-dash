import { Observable } from "rxjs";

export interface CiModel {
  project: Project;
  pipeline$: Observable<Pipeline | undefined> | undefined;
  commit$: Observable<Commit | undefined> | undefined;
}

export interface Project {
  id: number;
  name: string;
  description: string;
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

export interface Commit {
  id: string;
  short_id: string;
  title: string;
  author_name: string;
  author_email: string;
  committer_name: string;
  committer_email: string;
  created_at: Date;
  message: string;
  committed_date: Date;
  authored_date: Date;
  parent_ids: string[];
  last_pipeline: Pipeline,
  stats: {
    additions: number;
    deletions: number;
    total: number;
  },
  status: string;
}
