import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (
    private router: Router,
    private restService: RestService
  ) {}

  cases:any[] = [];

  public async getAllBoxes() {
    let data: any = [];
    data = await this.restService.getBoxes().toPromise();
    this.cases = data.message;
    console.log('data', data);
  }

  onCaseClick(item:any) {
    this.router.navigate(['/', 'box', item.id]);
  }

  ngOnInit() {
    this.getAllBoxes();
  }

}
