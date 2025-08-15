import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isUserMenuOpen = false;
  constructor() {}

  onSearchClick(): void {
    // Implement search functionality
    console.log('Search clicked');
  }

  onUserMenuClick(): void {
    // Implement user menu functionality
    console.log('User menu clicked');
  }

  onNavItemClick(item: string): void {
    // Implement navigation functionality
    console.log(`Navigation to ${item}`);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout(): void {
    // Implement logout functionality
    console.log('Logout clicked');
  }
}
