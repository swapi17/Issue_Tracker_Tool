import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse, HttpParams} from '@angular/common/http'
import { Router } from '@angular/router'
import {ResponseContentType} from '@angular/http'




@Injectable({
  providedIn: 'root'
})
export class AppService {

    headers = new HttpHeaders()

  constructor( private cookieService: CookieService, public http:HttpClient, public router: Router ) { 
    
  }

  


  public getUserInformationstorage=()=>{
   return (JSON.parse(localStorage.getItem('userInfo')));
  }

  public setUserInformationStorage=(data)=>{
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public isLoggedIn() {
    return(this.getUserInformationstorage())
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobile', data.mobile)
    .set('email', data.email)
    .set('password', data.password)
    
    return this.http.post(`/api/users/signup`, params);

  }

  public signinFuncction(data): Observable<any>{
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)

    return this.http.post(`/api/users/login`, params)
  }
  


  public logout(): Observable<any> {
    
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authtoken'))

    return this.http.post(`/api/users/logout`, params);

  } // end logout function

  public logOutWithGoogle(): Observable<any> {
    return this.http.get('/api/logout')
  }

  public allRegisterUsers(): Observable<any>{
    
    return this.http.get(`/api/users/view/all`);
  }

  public allSocialUsers(): Observable<any>{
    return this.http.get('/api/users/view/socialAll')
  }

  public createIssue(data): Observable<any>{

    const params = new HttpParams()
      .set('reporter',data.reporter)
      .set('title',data.title)
      .set('description',data.description)
      .set('reporterId',data.reporterId)
      .set('status',data.status)
      .set('assignedToId',data.assignedToId)
      .set('assignedTo',data.assignedTo)
      .set('images', data.images)

    return this.http.post('/api/issue/create',params)
  }

  public getAllIssue(): Observable<any>{
    return this.http.get('/api/issue/all')
  }

  public getSingleIssue = (issueId)=>{
    return this.http.get(`/api/view/${issueId}`);
  }

  public deleteIssue = (issueId)=>{
    let data = {}
    return this.http.post(`/api/issue/${issueId}/delete`, data)
  }

  public editIssue = (data)=>{
    const params = new HttpParams()
      .set('title',data.title)
      .set('issueId', data.issueId)
      .set('reporter', data.reporter)
      .set('reporterId', data.reporterId)
      .set('description',data.description)
      .set('status',data.status)
      .set('assignedToId',data.assignedToId)
      .set('assignedTo',data.assignedTo)
      .set('images', data.images)
    return this.http.post(`/api/issue/${data.issueId}/edit`, params)
  }

  public getAllAttachments = ()=>{
    return this.http.get('/api/file')
  }

  public downloadAttachment =(file)=>{

      return this.http.get(`/api/download/${file}`, 
        { responseType: 'blob', 
          headers: {'Content-type': 'text/xml'}
        }
          
          );
      
  }

  public searchIssue = (arg,skip=0)=>{
    return this.http.get(`/api/issue/search?arg=${arg}&skip=${skip}`);
  }

  public postWatch = (data)=>{
    const params = new HttpParams()
      .set('issueId', data)
      .set('watcherId', this.cookieService.get('userId'))

      return this.http.post('/api/watch', params)
  }

  public getWatchList = () =>{
    return this.http.get('/api/getwatcher')
  }

  public addComment = (commentData)=>{
    const params = new HttpParams()
      .set('issueId',commentData.issueId)
      .set('description',commentData.description)
      .set('reporter',this.cookieService.get('UserName'))
      .set('reporterId',this.cookieService.get('userId'))

    return this.http.post(`/api/addcomment`,params);
  }

  public getComment = (issueId) =>{
    return this.http.get(`/api/readcomment/${issueId}`)
  }

  public getNotification = () =>{
      return this.http.get(`/api/notification/${this.cookieService.get('userId')}`)
  }

  public notifyCount = () =>{
    const params = new HttpParams()
      .set('userId', this.cookieService.get('userId'))
      return this.http.post('/api/notifycount', params)
  }
}
