// src/app/navbar/navbar.component.ts
import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core'; // Add OnInit and OnDestroy
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { User, UserStateService } from '../Auth/user-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Implement OnInit and OnDestroy
  isUserMenuOpen = false;
  showNavbar = true;
  loggedInUser = 'Guest';
  private routerSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined; // Create a subscription for the user service

  constructor(private router: Router, private userService: UserStateService) {} // Inject the UserService

  ngOnInit(): void {
    // Check the current route on initialization
    this.checkRoute();

    // Subscribe to router events to show/hide the navbar dynamically
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
      });

    // Subscribe to the user service to get real-time updates
    this.userSubscription = this.userService.currentUser$.subscribe(
      (user: User | null) => {
        this.loggedInUser = user ? user.username : 'Guest';
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the router to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Unsubscribe from the user service to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
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

  onSearchClick(): void {
    console.log('Search clicked');
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout(): void {
    // Use the service to handle logout
    this.userService.logout();
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}
