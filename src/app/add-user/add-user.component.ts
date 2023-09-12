import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerRequestService } from '../services/server-request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  userForm: any = FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  public submitted: boolean | null = null;
  public showLoginProcessing: boolean | null = null;
  public show: boolean | null = null;
  public isUserEdit: boolean | null = null;
  public isUserId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private serverRequest: ServerRequestService,
    private route: ActivatedRoute
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
      this.isUserId = queryParams['userId'];
      if (this.isUserId !== undefined) {
        this.isUserEdit = true;
        this.getUserById(this.isUserId);
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

  getUserById(userId: number): void {
    this.serverRequest.getUserById(userId).subscribe({
      next: (response) => {
        this.userForm.patchValue(response);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        console.info('complete');
      },
    });
  }

  onSubmit(): void {
    this.showLoginProcessing = true;
    this.submitted = true;
    if (this.userForm.invalid) {
      this.showLoginProcessing = false;
      return;
    }
    const formData = JSON.stringify(this.userForm.value);
    if (this.isUserEdit) {
      this.editExitingUser(formData);
    } else {
      this.createNewUser(formData);
    }
  }

  createNewUser(formData: string) {
    this.serverRequest.addUser(formData).subscribe({
      next: (response) => {
        this.showLoginProcessing = false;
      },
      error: (e) => {
        this.showLoginProcessing = false;
        console.log(e);
      },
      complete: () => {
        this.showLoginProcessing = false;
        console.info('complete');
      },
    });
  }

  editExitingUser(formData: string) {
    this.serverRequest.editUser(formData, this.isUserId).subscribe({
      next: (response) => {
        this.showLoginProcessing = false;
      },
      error: (e) => {
        this.showLoginProcessing = false;
        console.log(e);
      },
      complete: () => {
        this.showLoginProcessing = false;
        console.info('complete');
      },
    });
  }
}
