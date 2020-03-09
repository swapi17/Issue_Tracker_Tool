import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService)  { }

  ngOnInit() {
  }

  public goToSignIn: any =()=>{
    this.router.navigate(['/'])
  }

  public signupFunction: any =()=>{
    if (!this.firstName){
      this.toastr.info('Enter first name')
    } else if(!this.lastName){
      this.toastr.info('enter last name')
    } else if(!this.mobile){
      this.toastr.info('enter mobile number')
    } else if(!this.password){
      this.toastr.info('enter password')
    } else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password
      }

      this.appService.signupFunction(data)
      .subscribe((apiResponse)=>{
        if (apiResponse.status===200){
          this.toastr.success('SingUp Successfully');
          setTimeout(()=>{
            this.goToSignIn();
          },2000);
        } else {
          this.toastr.info(apiResponse.message);
        }
      },(err)=>{
        this.toastr.warning('some error accoured')
      })
    }
  }


}
