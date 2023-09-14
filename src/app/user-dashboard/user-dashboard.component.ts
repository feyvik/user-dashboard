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

  constructor(
    private serverRequest: ServerRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListOfUser();
  }

  getListOfUser(): void {
    this.fetchUserData = true;
    this.serverRequest.getUsers().subscribe({
      next: (response) => {
        this.fetchUserData = false;
        this.listUserData = response;
        this.totalPageCount = response.length;
      },
      error: (e) => {
        this.fetchUserData = false;
        console.log(e);
      },
      complete: () => {
        this.fetchUserData = false;
        console.info('complete');
      },
    });
  }

  userDeletionInProgress(userId: number): boolean {
    return this.deletionInProcessUserId === userId;
  }

  deleteUserById(userId: number): void {
    this.deletionInProcessUserId = userId;
    this.serverRequest.deleteUser(userId).subscribe({
      next: (response) => {
        this.deletionInProcessUserId = 0;
        this.removeDeletedUserFromArray(response);
      },
      error: (e) => {
        this.deletionInProcessUserId = userId;
        console.log(e);
      },
      complete: () => {
        console.info('complete');
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
