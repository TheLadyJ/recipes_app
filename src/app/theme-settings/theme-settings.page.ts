import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.page.html',
  styleUrls: ['./theme-settings.page.scss'],
})
export class ThemeSettingsPage implements OnInit {

  static isDark:boolean=false;

  constructor() { }

  ngOnInit() {
  }

  onToggleDarkTheme(event: any){
    console.log(event)
    if(event.detail.checked){
      document.body.setAttribute('color-theme','dark');
      ThemeSettingsPage.isDark=true;
    } else{
      document.body.setAttribute('color-theme','light');
      ThemeSettingsPage.isDark=false;
    }

  }

  get isDark(){
    return ThemeSettingsPage.isDark;
  }

}
