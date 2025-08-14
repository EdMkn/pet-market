import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styles: []
})
export class ThemeSwitcherComponent implements OnInit {
  
  ngOnInit() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: string) {
    // Set the theme on the document element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Optional: Add some animation or feedback
    console.log(`Theme changed to: ${theme}`);
  }
} 