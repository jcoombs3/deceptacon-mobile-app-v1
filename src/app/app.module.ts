import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// PAGES
import { LoginPage } from '../pages/login/login';

// MODALS
import { CreateAccountModal } from '../modals/create-account/create-account';
import { ChangeProfilePicModal } from '../modals/change-profile-pic/change-profile-pic';
import { CreatePinModal } from '../modals/create-pin/create-pin';

// COMPONENTS
import { ProfilePic } from '../components/profile-pic/profile-pic';
import { PinPad } from '../components/pin-pad/pin-pad';

// PROVIDERS
import { DeceptaconService } from '../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../providers/assets-service/assets-service';

// NATIVE
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    
    CreateAccountModal,
    ChangeProfilePicModal,
    CreatePinModal,
    
    ProfilePic,
    PinPad
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    
    CreateAccountModal,
    ChangeProfilePicModal,
    CreatePinModal,
    
    ProfilePic,
    PinPad
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeceptaconService,
    AssetsService
  ]
})
export class AppModule {}
