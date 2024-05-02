import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  
  
  constructor(
    private restService: RestService
  ) {} 
  displayedColumns: string[] = ['item', 'server_seed', 'user_seed', 'nonce', 'hash'];
  dataSource = new MatTableDataSource([]);
  history:any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public async getHistory() {
    let data:any = [];
    data = await this.restService.getHistory().toPromise();
    this.history = data.message;
    await this.parseArray();
  }

  parseArray() {
    this.history.forEach(element => {
      element.item = JSON.parse(element.item);
    });
    this.dataSource.data = this.history;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getHistory();
  }

}
