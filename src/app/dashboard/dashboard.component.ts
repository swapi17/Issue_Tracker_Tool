import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public userName: String
  public firstChar: String
  public searchData: String;
  public backlogs = [];
  public inProgress = [];
  public inTest = [];
  public done = [];
  public watch = []
  public assignedIssue = [];
  public allData
  public allSearchData: any = []
  public notifications = []
  public notifyData = []
  public count = []
  public toggler: boolean = true
  public notifyToggler: boolean = false
  constructor(private toastr: ToastrService, public appService: AppService, public router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    this.userName = this.cookieService.get('UserName')
    this.firstChar = this.userName[0];

    this.appService.getAllIssue().subscribe(
      (response) => {
        this.allData = response['data'];
        if (this.allData !== null) {
          for (let x of this.allData) {
            if(x.assignedToId === this.cookieService.get('userId')){
              this.assignedIssue.push(x);
            }
            switch (x.status) {
              case 'Backlog':
                this.backlogs.push(x);
                break;
              case 'In-Progress':
                this.inProgress.push(x)
                break;
              case 'In-Test':
                this.inTest.push(x)
                break;
              case 'Done':
                this.done.push(x)
                break;
            }
          }
        }
      },
      (error) => {
        console.log(error)
      }
    )
    this.appService.getWatchList().subscribe(
      (response) => {
        for (let details of response['data']) {
          if (details.watcherId === this.cookieService.get('userId')) {
            if(this.allData !== null){
            for (let data of this.allData) {
              if (details.issueId === data.issueId) {
                this.watch.push(data)
              }
            }
          }
          }
        }
      }
    )

    this.appService.getNotification().subscribe(
      (response) => {
        this.notifications.push(response['data'])
        
        for (let x of this.notifications) {
          if(x !== null){
          for (let y of x) {
            if(y.notificationCount === 1){
            this.count.push(y.notificationCount)}
            let id = y.issueId
            for (let a of y.description) {
              let des = a
              let data = {
                issueId: id,
                descrip: des
              }
              this.notifyData.push(data)
            }
          }
        }
      }
        if(this.count.length===0){
          return this.notifyToggler = true
        }
      }
    )


  }

  public toggle: any = () => {

    let conditioner = this.appService.getUserInformationstorage().authToken
    if (conditioner !== undefined) {
      this.appService.logout()
        .subscribe(() => {
          this.cookieService.delete('authtoken')
          this.cookieService.delete('userId')
          this.cookieService.delete('UserName')
          this.router.navigate(['/'])
        })
    } else {
      this.appService.logOutWithGoogle()
        .subscribe(() => {
          this.cookieService.delete('userId')
          this.cookieService.delete('UserName')
          this.router.navigate(['/'])
        })
    }
  }

  public scrollNextBacklog = () => {
    document.getElementById('scrollBacklog').scrollBy(100, 0)
  }

  public scrollPreviousBacklog = () => {
    document.getElementById('scrollBacklog').scrollBy(-100, 0)
  }

  public scrollNextProgress = () => {
    document.getElementById('scrollProgress').scrollBy(100, 0)
  }

  public scrollPreviousProgress = () => {
    document.getElementById('scrollProgress').scrollBy(-100, 0)
  }

  public scrollNextTest = () => {
    document.getElementById('scrollTest').scrollBy(100, 0)
  }

  public scrollPreviousTest = () => {
    document.getElementById('scrollTest').scrollBy(-100, 0)
  }

  public scrollNextDone = () => {
    document.getElementById('scrollDone').scrollBy(100, 0)
  }

  public scrollPreviousDone = () => {
    document.getElementById('scrollDone').scrollBy(-100, 0)
  }

  public scrollNextWatch = () => {
    document.getElementById('scrollWatch').scrollBy(100, 0)
  }

  public scrollPreviousWatch = () => {
    document.getElementById('scrollWatch').scrollBy(-100, 0)
  }

  public back = () => {
    return this.toggler = true
  }

  public notifyCount = () =>{
    this.appService.notifyCount().subscribe(
      (response)=>{
        if(response['status']===200){
          return this.notifyToggler = true
        }
      }
    )
  }


  public searchIssue: any = () => {
    this.appService.searchIssue(this.searchData).subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.searchData = "";
          this.allSearchData = response['data'];
          return this.toggler = false
        } else if (response['status'] == 404) {
          this.toastr.info('No result Found')
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error('Some error ocurred');
      }
    )

  }

}
