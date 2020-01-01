import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Settings } from './settings';
import { SettingsService } from './settings.service';

@Component({
  selector: 'ci-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  gitlabUrl = 'https://gitlab.edina.ac.uk';
  key = '';
  groupIds = '';

  constructor(private dialogRef: MatDialogRef<SettingsComponent>, private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.settings$.subscribe(s => {
      this.gitlabUrl = s.url;
      this.key = s.key;
      this.groupIds = s.groupIds;
    });
  }

  onClose() {
    this.dialogRef.close({
      url: this.gitlabUrl,
      key: this.key,
      groupIds: this.groupIds,
    } as Settings);
  }
}
