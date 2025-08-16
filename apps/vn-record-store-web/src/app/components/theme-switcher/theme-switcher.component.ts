import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styles: []
})
export class ThemeSwitcherComponent implements OnInit {
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  
  ngOnInit() {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Load saved theme from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.setTheme(savedTheme);
      }
    }
  }

  setTheme(theme: string) {
    // Only access document and localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Set the theme on the document element
      document.documentElement.setAttribute('data-theme', theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      // Optional: Add some animation or feedback
      console.log(`Theme changed to: ${theme}`);
    }
  }
} 