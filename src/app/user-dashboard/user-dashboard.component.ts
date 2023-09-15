import { Component } from '@angular/core';
import {
  ServerRequestService,
  IUserDTO,
} from '../services/server-request.service';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../app.animation';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  animations: [fadeInAnimation],
})
export class UserDashboardComponent {
  public listUserData: IUserDTO[] = [];
  public page: number = 1;
  public pageSize: number = 6;
  public totalPageCount: number = 0;
  public deletionInProcessUserId: number = 0;
  public fetchUserData: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  filteredUsers: IUserDTO[] = []; // Initialize with all users

  searchInput: string = '';

  constructor(
    private serverRequest: ServerRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListOfUser();
  }

  getListOfUser(): void {
    this.errorMessage = null;

    this.fetchUserData = true;
    this.serverRequest.getUsers().subscribe({
      next: (response) => {
        this.listUserData = response;
        this.filteredUsers = [...this.listUserData];
        this.fetchUserData = false;
        this.totalPageCount = response.length;
      },
      error: (e) => {
        this.fetchUserData = false;
        this.errorMessage = e.errorMessage;
        setInterval(() => {
          this.errorMessage = null;
        }, 4000);
      },
      complete: () => {
        this.fetchUserData = false;
      },
    });
  }

  filterUsers(): void {
    if (this.searchInput.trim().split(' ')[0] === '') {
      this.filteredUsers = this.listUserData;
    } else {
      let te = this.searchInput.toLowerCase();
      if (te.length >= 2) {
        this.filteredUsers = this.listUserData.filter(
          (user) =>
            user.name.firstname.toLowerCase().includes(te) ||
            user.name.lastname.toLowerCase().includes(te) ||
            user.email.toLowerCase().includes(te)
        );
      }
    }

    this.filteredUsers.length === 0
      ? (this.errorMessage = 'No User Record Found')
      : (this.errorMessage = '');
  }

  userDeletionInProgress(userId: number): boolean {
    return this.deletionInProcessUserId === userId;
  }

  deleteUserById(userId: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.deletionInProcessUserId = userId;
    this.serverRequest.deleteUser(userId).subscribe({
      next: (response) => {
        this.deletionInProcessUserId = 0;
        this.removeDeletedUserFromArray(response);
      },
      error: (e) => {
        this.deletionInProcessUserId = 0;
        this.errorMessage = e.errorMessage;
        setInterval(() => {
          this.errorMessage = null;
        }, 4000);
      },
      complete: () => {
        this.successMessage = 'User deleted successfully!';
        this.deletionInProcessUserId = 0;
        setInterval(() => {
          this.successMessage = null;
        }, 4000);
      },
    });
  }

  removeDeletedUserFromArray(user: IUserDTO): void {
    this.listUserData = [...this.listUserData.filter((m) => m.id !== user.id)];
    this.totalPageCount = this.listUserData.length;
  }

  editSelectedUserId(userId: number): void {
    const queryParams = { userId };
    this.router.navigate(['user-dashboard/add-user'], { queryParams });
  }
}
