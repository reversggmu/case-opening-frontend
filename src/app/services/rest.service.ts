import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class RestService {

    constructor(
        private readonly http: HttpClient
    ) {}

    public SERVER_DOMAIN = 'http://localhost';
    public SERVER_PORT = '8080';

    public getTest(): Observable<any> {
        return this.http.get<any>('https://cat-fact.herokuapp.com/facts/');
    }

    public getUserInformation(id): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/user/information/${id}`);
    }

    public updateUserInformation(id, param): Observable<any> {
        return this.http.put<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/user/information/${id}`, param);
    }

    public addUserHistory(param): Observable<any> {
        return this.http.post<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/history`, param);
    }

    public getHistory(): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/history`);
    }

    public getBoxes(): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/box`);
    }

    public getBoxInformation(id): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/box/${id}`);
    }

    public createBox(param): Observable<any> {
        return this.http.post<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/box/create`, param);
    }

    public getSkins(): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/skin`);
    }

    public getSkin(id): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/skin/${id}`);
    }

    public getWeapons(): Observable<any> {
        return this.http.get<any>(`${this.SERVER_DOMAIN}:${this.SERVER_PORT}/weapon`);
    }
    
}