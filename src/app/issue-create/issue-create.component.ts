import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { FileUploader} from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';

const uri = '/api/upload'
@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {

  uploader : FileUploader = new FileUploader({url:uri})

  public attachmentList :any = []

  constructor(private toastr: ToastrService, public appService: AppService, public router: Router, private cookieService: CookieService) { 
    this.allRetrivedUsers()
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
      this.attachmentList.push(JSON.parse(response))
      console.log(this.attachmentList)
      
    }
    

  }
  public issueTitle: string
  public allUsers = []
  public fileId = []
  public assignedToId: string
  public assignedTo: string
  public description: string
  public allStatus = ["Backlog", "In-Progress", "In-Test", "Done"]
  public issue: any
  public issueStatus: string
  ngOnInit() {
    
    
  }

  

  public allRetrivedUsers = () => {
    let allUsers = []
    this.appService.allRegisterUsers()
      .subscribe((apiResponse) => {
        for (let x of apiResponse.data) {
          allUsers.push(x)
        }
      })

    this.appService.allSocialUsers()
      .subscribe((apiResponse) => {
        for (let y of apiResponse.data) {
          allUsers.push(y)  
        }

      })

    this.allUsers = allUsers

  }

  public createIssue = () => {
    for (let x of this.allUsers) {
      if (x.userId === this.assignedToId) {
        var name = x.firstName + " " + x.lastName
      }
    }

    for(let y of this.attachmentList){
      console.log(y.file.id)
      this.fileId.push(y.file.id)
    } 

    this.assignedTo = name
    console.log(this.fileId)
    let reporter = this.cookieService.get('UserName')
    let reporterId = this.cookieService.get('userId')


    this.issue = {
      status: this.issueStatus,
      title: this.issueTitle,
      description: this.description,
      assignedTo: this.assignedTo,
      assignedToId: this.assignedToId,
      reporter: reporter,
      reporterId: reporterId,
      images: this.fileId
    }

    this.appService.createIssue(this.issue).subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.toastr.success('New Issue Created');
          console.log(response);
          setTimeout(() => {
            this.router.navigate(['/dashboard'])
          }, 2000)
        }
      }
    )
  }


}
