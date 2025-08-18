import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  imports: [ RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'vn-record-store-web';
  
  constructor() {
    console.log('🚀 AppComponent initialized', {
      platform: typeof window !== 'undefined' ? 'browser' : 'server',
      location: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString()
    });
  }
}
