import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from './settings.component';
import { Settings } from './settings';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private matDialog: MatDialog, private settingsService: SettingsService) {}

  onOpenSettings() {
    this.matDialog.open(SettingsComponent).afterClosed().subscribe((s: Settings) => {
      this.settingsService.onSettingsChange(s);
    });
  }
}
