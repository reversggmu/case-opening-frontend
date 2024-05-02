import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { RestService } from '../../services/rest.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-box',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, CommonModule, FormsModule, MatSliderModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './create-box.component.html',
  styleUrl: './create-box.component.scss'
})
export class CreateBoxComponent {

  constructor(
    private router: Router,
    private restService: RestService
  ) {}

  boxInformation:any = {
    name: '',
    img: '',
    price: 0,
    fee: 10,
    items: []
  }
  skins:any[] = [];
  skinsToSelect:any[] = [];
  
  public async getAllSkins() {
    let data:any = [];
    data = await this.restService.getSkins().toPromise();
    this.skins = data.message;
    this.skinsToSelect = this.skins;
  }

  public onRemoveSkinClick(skin: any) {
    this.boxInformation.items.forEach((element, index) => {
      if(element.id === skin.id) {
        this.boxInformation.items.splice(index, 1);
      }
    });
    console.log('asdasd')
  }

  public onSkinClick(skin: any) {
    if (!this.checkIfSkinAlreadyExist(skin) && this.boxInformation.items.length < 10) {
      let skinInformation = {
        id: skin.id,
        name: skin.name,
        quality: skin.quality,
        img: skin.img,
        chance: 0,
        price: skin.price
      }
      this.boxInformation.items.push(skinInformation);
    }
  }

  public checkIfSkinAlreadyExist(skin: any) {
    return this.boxInformation.items.find(item => item.id === skin.id);
  }

  public getCurrentPercentage() {
    let sum = 0;
    this.boxInformation.items.forEach(element => {
      sum += element.chance;
    });
    return sum;
  }

  public calculateBoxPrice() {
    let sum = 0;
    this.boxInformation.items.forEach(element => {
      sum += element.price * element.chance/100;
    });
    sum += sum*this.boxInformation.fee/100;
    this.boxInformation.price = sum.toFixed(2);
  }

  public onCreateBox() {
    let dataToSend = this.boxInformation;
    dataToSend.items = JSON.stringify(dataToSend.items);
    this.restService.createBox(dataToSend).toPromise();
    this.router.navigate(['/', 'dashboard']);
  }

  ngOnInit() {
    this.getAllSkins();
  }
}
