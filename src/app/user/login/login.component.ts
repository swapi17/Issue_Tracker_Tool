import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService} from 'ngx-cookie-service';
import { AppService} from './../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(private cookieService : CookieService, private toastr: ToastrService, public appService : AppService, public router: Router) { }

  ngOnInit() {
  }

  public goToSignUp: any =()=>{
    this.router.navigate(['/signup'])
  }

  public signinFunction: any =()=>{
    if (!this.email){
      this.toastr.warning('Please Enter Email')
    } else if (!this.password){
      this.toastr.warning('Please Enter Password')
    } else {
      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFuncction(data)
      .subscribe((apiResponse)=>{
        if(apiResponse.status===200){
          console.log(apiResponse)
          this.cookieService.set('authtoken', apiResponse.data.authToken);
          this.cookieService.set('userId', apiResponse.data.userDetails.userId);
          this.cookieService.set('UserName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInformationStorage(apiResponse.data)
          this.router.navigate(['/dashboard'])
        } else{
          this.toastr.info(apiResponse.message)
        }
      })
    }
  }

  public googleLogin: any =()=>{
    window.open('/auth/google', "mywindow","location=1,status=1,scrollbars=1, width=800,height=800")
    let listener = window.addEventListener('message', (message) => {
      console.log(message)
      this.appService.setUserInformationStorage(message.data.user)
      this.cookieService.set('userId', message.data.user.userId);
      this.cookieService.set('UserName', message.data.user.firstName + ' ' + message.data.user.lastName);
      this.router.navigate(['/dashboard'])
    });
    
  }
  
}
