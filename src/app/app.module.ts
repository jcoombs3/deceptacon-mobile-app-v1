import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { 
  url:'https://deceptacon-mobile-socket.herokuapp.com/', 
  options: {} 
};

// PAGES
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CirclesPage } from '../pages/circles/circles';
import { GamePage } from '../pages/game/game';
import { ProfilePage } from '../pages/profile/profile';

// MODALS
import { CreateAccountModal } from '../modals/create-account/create-account';
import { ChangeProfilePicModal } from '../modals/change-profile-pic/change-profile-pic';
import { CreatePinModal } from '../modals/create-pin/create-pin';
import { GameSurveyModal } from '../modals/game-survey/game-survey';
import { ModSurveyModal } from '../modals/mod-survey/mod-survey';
import { CodeConductModal } from '../modals/code-conduct/code-conduct';

// COMPONENTS
import { DeceptaconFooter } from '../components/deceptacon-footer/deceptacon-footer';
import { ProfilePic } from '../components/profile-pic/profile-pic';
import { PinPad } from '../components/pin-pad/pin-pad';
import { VillagerDetail } from '../components/villager-detail/villager-detail';
import { PlaceholderDetail } from '../components/placeholder-detail/placeholder-detail';

// PROVIDERS
import { DeceptaconService } from '../providers/deceptacon-service/deceptacon-service';
import { AssetsService } from '../providers/assets-service/assets-service';

// NATIVE
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    CirclesPage,
    GamePage,
    ProfilePage,
    
    CreateAccountModal,
    ChangeProfilePicModal,
    CreatePinModal,
    GameSurveyModal,
    CodeConductModal,
    ModSurveyModal,
    
    DeceptaconFooter,
    ProfilePic,
    PinPad,
    VillagerDetail,
    PlaceholderDetail
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    CirclesPage,
    GamePage,
    ProfilePage,
    
    CreateAccountModal,
    ChangeProfilePicModal,
    CreatePinModal,
    GameSurveyModal,
    CodeConductModal,
    ModSurveyModal,
    
    DeceptaconFooter,
    ProfilePic,
    PinPad,
    VillagerDetail,
    PlaceholderDetail
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeceptaconService,
    AssetsService
  ]
})
export class AppModule {}
