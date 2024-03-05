import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonText,
  IonItem,
  IonCard,
  IonRow,
  IonCol,
  IonToast,
} from '@ionic/angular/standalone';
import { BiometryType, NativeBiometric } from 'capacitor-native-biometric';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonCol,
    IonRow,
    IonCard,
    IonItem,
    IonText,
    IonIcon,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
  ],
})
export class HomePage {
  form!: FormGroup;
  isPwd = false;
  server = 'www.faceid.technyks.com';
  isToast = false;
  toastMessage!: string;

  constructor() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  togglePwd() {
    this.isPwd = !this.isPwd;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.saveCredentials(this.form.value);
  }

  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable({ useFallback: true });
      if (!result.isAvailable) return;

      const isFaceID = result.biometryType == BiometryType.FACE_ID;
      console.log(isFaceID);

      const verified = await NativeBiometric.verifyIdentity({
        reason: 'Authentication',
        title: 'Log in',
        subtitle: 'FACE ID',
        description: 'Your Face ID needed for authorisation',
        useFallback: true,
        maxAttempts: 2,
      })
        .then(() => true)
        .catch(() => false);

      if (!verified) return;

      this.getCredentials();
    } catch (e) {
      console.log(e);
    }
  }

  async saveCredentials(data: { email: string; password: string }) {
    try {
      // const result = await NativeBiometric.isAvailable();
      // if (!result.isAvailable) return;
      // Save user's credentials
      await NativeBiometric.setCredentials({
        username: data.email,
        password: data.password,
        server: this.server,
      });

      this.openToast('Login Successful');
    } catch (e) {
      console.log(e);
    }
  }

  async getCredentials() {
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.server,
      });
      console.log(credentials);
      this.openToast(`Authorised! Credentials: ${credentials.username}, ${credentials.password}`);
    } catch (e) {
      console.log(e);
    }
  }

  deleteCredentials() {
    // Delete user's credentials
    NativeBiometric.deleteCredentials({
      server: this.server,
    }).then(() => {
      this.openToast('Credentials deleted');
    });
  }

  openToast(msg: string) {
    this.isToast = true;
    this.toastMessage = msg;
  }
}
