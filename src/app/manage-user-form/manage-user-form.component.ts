import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ICustomError,
  ISaveUserDTO,
  ServerRequestService,
} from '../services/server-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation } from '../app.animation';

@Component({
  selector: 'app-manage-user-form',
  templateUrl: './manage-user-form.component.html',
  styleUrls: ['./manage-user-form.component.scss'],
  animations: [fadeInAnimation],
})
export class ManageUserFormComponent {
  public userForm: any = FormGroup;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public submitted: boolean | null = null;
  public showLoginProcessing: boolean | null = null;
  public show: boolean | null = null;
  public isUserEdit: boolean | null = null;
  public selectedUserId: number = 0;
  public loadingResponse: boolean | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private serverRequest: ServerRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          ),
        ]),
      ],
      name: this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
      }),
      address: this.formBuilder.group({
        city: ['', Validators.required],
        street: ['', Validators.required],
        number: ['', Validators.required],
        zipcode: ['', Validators.required],
        geolocation: this.formBuilder.group({
          lat: ['', Validators.required],
          long: ['', Validators.required],
        }),
      }),
      phone: ['', Validators.required],
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.selectedUserId = queryParams['userId'];

      if (this.selectedUserId !== undefined) {
        this.isUserEdit = true;
        this.getUserById(this.selectedUserId);
      }
    });
  }

  get user() {
    return this.userForm.controls;
  }

  toggleIcon() {
    this.show = !this.show;
    const password = <HTMLInputElement>document.querySelector('#password');
    const type =
      password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    if (this.show) {
      (<HTMLInputElement>(
        document.querySelector('#toggleIconOpen')
      )).style.display = 'none';
    } else {
      (<HTMLInputElement>(
        document.querySelector('#toggleIconOpen')
      )).style.display = 'block';
    }
  }

  private _handleObservableError(error: ICustomError) {
    this.showLoginProcessing = false;
    this.errorMessage = error.errorMessage;

    setInterval(() => {
      this.errorMessage = null;
    }, 4000);
  }

  private _handleObservableComplete(msg: string) {
    this.showLoginProcessing = false;
    this.successMessage = msg;
    setInterval(() => {
      this.successMessage = null;
    }, 4000);
  }

  getUserById(userId: number): void {
    this.errorMessage = null;

    this.serverRequest.getUserById(userId).subscribe({
      next: (response) => {
        this.userForm.patchValue(response);
      },
      error: this._handleObservableError,
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showLoginProcessing = true;
    this.submitted = true;

    if (this.userForm.invalid) {
      this.showLoginProcessing = false;
      return;
    }

    const formData = this.userForm.value as ISaveUserDTO;

    if (this.isUserEdit) {
      this.editExitingUser(this.selectedUserId, formData);
    } else {
      this.createNewUser(formData);
    }
  }

  createNewUser(newUser: ISaveUserDTO) {
    this.serverRequest.addUser(newUser).subscribe({
      next: (_) => {
        this.showLoginProcessing = false;
      },
      error: this._handleObservableError,
      complete: () =>
        this._handleObservableComplete('User added successfully!'),
    });
  }

  editExitingUser(id: number, user: ISaveUserDTO) {
    this.serverRequest.editUser(id, user).subscribe({
      next: (_) => {
        this.showLoginProcessing = false;
      },
      error: this._handleObservableError,
      complete: () =>
        this._handleObservableComplete('User edited successfully!'),
    });
  }

  goToUserDasboard() {
    this.router.navigate(['/user-dashboard']);
  }
}
