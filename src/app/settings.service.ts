import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Settings } from './settings';

@Injectable()
export class SettingsService {
  private _settings$ = new ReplaySubject<Settings>(1);

  constructor() {
    this._settings$.next({
      url: localStorage.getItem('url') || '',
      key: localStorage.getItem('key') || '',
      groupIds: localStorage.getItem('groupIds') || '',
    });
  }

  onSettingsChange(s: Settings) {
    localStorage.setItem('url', s.url);
    localStorage.setItem('key', s.key);
    localStorage.setItem('groupIds', s.groupIds);

    this._settings$.next(s);
  }

  get settings$(): Observable<Settings> {
    return this._settings$.asObservable();
  }
}
