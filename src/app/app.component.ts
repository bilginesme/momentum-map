import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'momentum-map';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Default language
    this.translate.use('en'); // Set initial language
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
