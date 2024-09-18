import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseData } from '../models/ResponeData';
import { FileResponse } from '../models/FileResponse.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  API_URL  = 'http://localhost:8080/file/upload';
  constructor(private http:HttpClient) { }
  uploadFile(data: FormData): Observable<ResponseData<FileResponse>>  {
    return this.http.post<ResponseData<FileResponse>>(this.API_URL, data);
  }
}
