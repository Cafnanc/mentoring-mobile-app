import { Component, HostListener, NgZone } from '@angular/core';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { localKeys } from './core/constants/localStorage.keys';
import * as _ from 'lodash-es';
import { UtilService,DbService,UserService,LocalStorageService,AuthService,NetworkService, HttpService} from './core/services';
import { CommonRoutes } from 'src/global.routes';
import { Router} from '@angular/router';
import { ProfileService } from './core/services/profile/profile.service';
import { Location } from '@angular/common';
// import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 user;
 public appPages = [
  { title: 'HELP', action: "help", icon: 'help-circle', url: CommonRoutes.HELP},
  { title: 'FAQ', action: "faq", icon: 'alert-circle', url: CommonRoutes.FAQ},
  { title: 'HELP_VIDEOS', action: "help videos", icon: 'videocam',url: CommonRoutes.HELP_VIDEOS },
  { title: 'LANGUAGE', action: "selectLanguage", icon: 'language', url: CommonRoutes.LANGUAGE },
];
  deferredPrompt;
  isMentor:boolean
  showAlertBox = false;
  showButton: boolean=false;
  constructor(
    private translate :TranslateService,
    private platform : Platform,
    private localStorage: LocalStorageService,
    public menuCtrl:MenuController,
    private userService:UserService,
    private utilService:UtilService,
    private db:DbService,
    private router: Router,
    private network:NetworkService,
    private http: HttpService,
    private authService:AuthService,
    private profile: ProfileService,
    private zone:NgZone,
    private _location: Location,
    private alert: AlertController,
    // private screenOrientation: ScreenOrientation,
  ) {
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log('👍', 'beforeinstallprompt', event);
      // Stash the event so it can be triggered later.
      this.deferredPrompt = event;
      this.showButton = true;
      // Remove the 'hidden' class from the install button container.
    });
    this.initializeApp();
    this.router.navigate(["/"]);
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  subscribeBackButton() {
    this.platform.backButton.subscribeWithPriority(10,async () => {
      if (this._location.isCurrentPathEqualTo("/tabs/home")){
        let texts: any;
        this.translate.get(['EXIT_CONFIRM_MESSAGE', 'CANCEL', 'CONFIRM']).subscribe(text => {
          texts = text;
        })
        const alert = await this.alert.create({
          message: texts['EXIT_CONFIRM_MESSAGE'],
          buttons: [
            {
              text: texts['CANCEL'],
              role: 'cancel',
              cssClass: "alert-button",
              handler: () => { }
            },
            {
              text: texts['CONFIRM'],
              role: 'confirm',
              cssClass: "alert-button",
              handler: () => { 
                navigator['app'].exitApp();
              }
            }
          ]
        });
        await alert.present();
      } else {
        this._location.back();
      }
    });
  }

  showInstallBanner() {
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // We no longer need the prompt.  Clear it up.
        this.deferredPrompt = null;
      });
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.network.netWorkCheck();
      this.setHttpHeaders().then(() => {
        this.languageSetting();
      })
      this.db.init();
      setTimeout(async ()=>{
        const userDetails = await this.localStorage.getLocalData(localKeys.USER_DETAILS);
        if(userDetails){
          this.getUser();
        }
      },1000);
      // setTimeout(() => {
      //   document.querySelector('ion-menu').shadowRoot.querySelector('.menu-inner').setAttribute('style', 'border-radius:8px 8px 0px 0px');
      // }, 2000);

      this.userService.userEventEmitted$.subscribe(data=>{
        if(data){
          this.isMentor = data?.isAMentor;
          this.user = data;
        }
      })
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
          const domain = environment.deepLinkUrl
          const slug = event.url.split(domain).pop();
          if (slug) {
            this.router.navigateByUrl(slug);
          }
        });
    });
    });
    this.subscribeBackButton();
  }
  showInstallPromotion() {
    throw new Error('Method not implemented.');
  }

  async setHttpHeaders() {
    await this.http.setHeader();
    this.userService.userEventEmitted$.subscribe(async () => {
      await this.http.setHeader();
    })
  }

  languageSetting() {
    this.localStorage.getLocalData(localKeys.SELECTED_LANGUAGE).then(data =>{
      if(data){
        this.translate.use(data);
      } else {
      this.setLanguage('en');
      }
    }).catch(error => {
      this.setLanguage('en');
    })
  }

  setLanguage(lang){
    this.localStorage.setLocalData(localKeys.SELECTED_LANGUAGE,lang).then(data =>{
      this.translate.use(lang);
    }).catch(error => {
      this.translate.use(lang)
    })
  }

  logout(){
    this.menuCtrl.toggle();
    let msg = {
      header: 'LOGOUT',
      message: 'LOGOUT_CONFIRM_MESSAGE',
      cancel:'CANCEL',
      submit:'LOGOUT'
    }
    this.utilService.alertPopup(msg).then(async (data) => {
      if(data){
        await this.localStorage.setLocalData(localKeys.SELECTED_LANGUAGE, "en");
        this.translate.use("en")
        this.authService.logoutAccount();
      }
    }).catch(error => {})
  }
  
  getUser() {
    this.profile.profileDetails(false).then(profileDetails => {
      this.user = profileDetails;
      this.isMentor = this.user?.isAMentor
    })
  }
  goToProfilePage(){
    this.menuCtrl.close();
    this.router.navigate([`${CommonRoutes.TABS}/${CommonRoutes.PROFILE}`]);
  }

  async menuItemAction(menu) {
    switch (menu.title) {
      case 'LANGUAGE': {
        this.alert.create({
          
        })
        break;
      }
      case 'CREATED_BY_ME': {
        this.router.navigate([`${CommonRoutes.CREATED_BY_ME}`]);
        break;
      }
    }
  }

  async showAlert(alertData){
    
  }

}

