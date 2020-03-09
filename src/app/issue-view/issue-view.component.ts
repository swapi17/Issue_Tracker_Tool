import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from './../app.service'
import { Location } from "@angular/common";
import { saveAs } from 'file-saver'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css'],
  providers: [Location]
})
export class IssueViewComponent implements OnInit {

  public watchData:any=[]
  public issueId: String
  public responseData: any
  public attachmentList = []
  public filedId = []
  public fileName = []
  public comment:String;
  public commentData:any;
  public makeComment:any;
  constructor(private toastr: ToastrService ,private _route: ActivatedRoute, private appService: AppService, private location: Location, public router: Router) { }

  ngOnInit() {
    this.issueId = this._route.snapshot.paramMap.get('issueId');

    this.appService.getSingleIssue(this.issueId).subscribe(
      (response) => {
        if (response["status"] === 200) {
          this.responseData = response['data']
          this.watchData.push(this.responseData)
          for (let imgId of this.responseData.images) {
            this.filedId.push(imgId)
          }
        } else {
          this.toastr.info('No Issue Found')
        }
      }
    )

    this.appService.getAllAttachments().subscribe(
      (response) => {
        this.attachmentList.push(response['data'])
        for (let x of this.attachmentList) {
          for (let y of x) {
            for (let a of this.filedId) {
              if (a === y._id) {
                this.fileName.push(y.filename)
              }
            }
          }
        }
      }
    )
    
    this.getComment()
    
  }

  public getComment = () =>{
    this.appService.getComment(this.issueId).subscribe(
      (response)=>{
        this.commentData = response['data'];
      }
    )
  }

  public goBack(): any {
    this.location.back();
  }

  public download = (index) => {
    let fileId = this.fileName[index]
    this.appService.downloadAttachment(fileId).subscribe(
      (response) => {
        saveAs(response, response['filename'])
      }
    )
  }

  public deleteIssue = () =>{
    this.appService.deleteIssue(this.issueId)
      .subscribe(
        (response)=>{
          this.toastr.success(response['message'])
          setTimeout(()=>{
            this.router.navigate(['/dashboard']);
          },1000)
        }
      )

  }

  public watch = () =>{
    this.appService.postWatch(this.issueId).subscribe(
      (response)=>{
          this.toastr.success(response['message'])
      }
    )
  }

  public addComment = ()=>{
    this.makeComment = {
      issueId:this.issueId,
      description:this.comment
    }

    this.appService.addComment(this.makeComment).subscribe(
      (response)=>{
        this.toastr.success(response['message'])
        this.getComment()
        this.comment=''
      }
    )
  }

}
