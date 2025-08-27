import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isUserMenuOpen = false;
  showNavbar = true;
  loggedInUser = 'Guest';
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check the current route on initialization
    this.checkRoute();

    // Subscribe to router events to show/hide the navbar dynamically
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });

    // Load the user's name from local storage
    this.loadUserName();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the router to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * @description
   * Determines whether to show the navbar based on the current route.
   */
  checkRoute(): void {
    // Hide the navbar on the login page
    this.showNavbar = this.router.url !== '/login';
  }

  /**
   * @description
   * Retrieves the username from local storage.
   */
  loadUserName(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.username) {
          this.loggedInUser = user.username;
        }
      } catch (e) {
        console.error('Could not parse user data from localStorage', e);
      }
    }
  }

  onSearchClick(): void {
    console.log('Search clicked');
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout(): void {
    // Clear user data from local storage
    localStorage.removeItem('currentUser');
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
