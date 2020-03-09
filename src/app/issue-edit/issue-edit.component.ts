import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { FileSelectDirective, FileUploader} from 'ng2-file-upload'
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

const uri = '/api/upload'
@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css']
})
export class IssueEditComponent implements OnInit {

  uploader : FileUploader = new FileUploader({url:uri})

  public attachmentList :any = []
  public singleAttachment: any = []
  constructor(private toastr: ToastrService, public appService: AppService, public router: Router, private cookieService: CookieService, private _route:ActivatedRoute) { 
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
      this.singleAttachment.push(JSON.parse(response))
      console.log(this.singleAttachment)
  }
  }

  public issueTitle: string
  public allUsers = []
  public fileId = []
  public newFileId = []
  public assignedToId: string
  public assignedTo: string
  public description: string
  public allStatus = ["Backlog", "In-Progress", "In-Test", "Done"]
  public issue: any
  public issueStatus: string
  public issueId:String;
  public issueImage = []
  public fileName = []

  ngOnInit() {

    this.allRetrivedUsers()

    this.issueId =this._route.snapshot.paramMap.get('issueId');

    this.appService.getSingleIssue(this.issueId)
          .subscribe(
            (response)=>{
              if(response['status']==200){
                this.issue = response['data']; 
                this.issueTitle = response['data']['title'];
                this.description = response['data']['description'];
                this.assignedToId = response['data']['assignedToId'];
                this.assignedTo = response['data']['assignedTo'];
                this.issueStatus = response['data']['status'];
                this.issueImage = response['data']['images']
                for(let img of this.issueImage){
                  this.fileId.push(img)
                }
              }else{
                this.toastr.info('No issue Found')
              }
            }
          )
          this.appService.getAllAttachments().subscribe(
            (response) => {
              this.attachmentList.push(response['data'])
              for (let x of this.attachmentList) {
                for (let y of x) {
                  for (let a of this.fileId) {
                    if (a === y._id) {
                      this.fileName.push(y.filename)
                    }
                  }
                }
              }
            }
          )        
    
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

  public download = (index) => {
    let fileId = this.fileName[index]
    this.appService.downloadAttachment(fileId).subscribe(
      (response) => {
        saveAs(response, response['filename'])
      }
    )
  }
  public createIssue = () => {
    for (let x of this.allUsers) {
      if (x.userId === this.assignedToId) {
        var name = x.firstName + " " + x.lastName
      }
    }

    for(let y of this.singleAttachment){
      console.log(y.file.id)
      this.fileId.push(y.file.id)
    } 

    this.assignedTo = name
    console.log(this.fileId)
    


    this.issue = {
      issueId:this.issue.issueId,
      status: this.issueStatus,
      title: this.issueTitle,
      reporter: this.issue.reporter,
      reporterId: this.issue.reporterId,
      description: this.description,
      assignedTo: this.assignedTo,
      assignedToId: this.assignedToId,
      images: this.fileId
    }

    this.appService.editIssue(this.issue).subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.toastr.success('Issue Edited Successfully');
          console.log(response);
          setTimeout(() => {
            this.router.navigate([`/issue-view/${this.issueId}`])
          }, 2000)
        }
      }
    )
  }

}
