import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment.local';
import { Md5 } from 'ts-md5/dist/md5';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private restService: RestService,
    public dialog: MatDialog
  ) {}

  boxInformation:any = {};
  boxId:any = null;
  maxRange = 100000;
  arraySkins:any[] = [];
  arrayContentSkins:any[] = [];
  arraySkinsIndex:any[] = [];
  serverSeed = environment.serverSeed;
  apiKey = environment.apiKey;
  userSeed = '';
  md5 = new Md5();
  nonce = 0;
  transformX = -50;
  delay = 100;
  transformValue = 70;
  loaded = false;
  audioCase = new Audio('../../../assets/case.mp3');
  audioCaseOpen = new Audio('../../../assets/open.mp3');
  
  testString = '';
  testHash = '';

  public async getUserInformation() {
    let data: any = {};
    data = await this.restService.getUserInformation(1).toPromise();
    this.userSeed = data.message[0].user_seed;
    this.nonce = data.message[0].nonce;
  }

  public async getBoxInformation() {
    let data:any = {};
    this.activatedRoute.params.subscribe(paramId => {
      this.boxId = paramId["id"];
    })

    data = await this.restService.getBoxInformation(this.boxId).toPromise();
    this.boxInformation = data.message[0];
    this.boxInformation.items = JSON.parse(this.boxInformation.items);
    await this.setSeedIntoItems();
  }

  public setSeedIntoItems() {
    let range = 0;
    this.boxInformation.items.forEach(element => {
      let ranges = (this.maxRange *element.chance) /100;
      element.minRange = range;
      element.maxRange = range+ranges-1;
      range=element.maxRange + 1;
    });
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  public generateArray() {
    this.boxInformation.items.forEach(element => {
      for(let i=element.minRange;i <= element.maxRange; i++) { //element.maxRange
        this.arraySkins[i] = {
          id: element.id,
          name: element.name,
          quality: element.quality,
          img: element.img,
          price: element.price
        }
        this.arraySkinsIndex[i] = element.id;
      }
    });
    this.createBoxes();
  }

  public shuffle = (array: string[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  public createBoxes() {
    for(let i=0; this.arrayContentSkins.length < 60; i++) {
      this.boxInformation.items.forEach(element => {
        this.arrayContentSkins.push(element);
      });
    }
  }

  public async onOpenBoxClick() {
    this.loaded = true;
    this.createBoxes();
    this.shuffle(this.arrayContentSkins);
    let winner = this.getRandomInt(this.maxRange);
    let winnerContentSkin:any = {};
    this.arraySkinsIndex = this.shuffle(this.arraySkinsIndex);
    this.arraySkins = this.shuffle(this.arraySkins);
    winnerContentSkin = this.arraySkins[winner];
    this.arrayContentSkins[50] = winnerContentSkin;
    let result:any = {hash: '', nonce: ''}
    let stringToHash = `${this.boxId}-${JSON.stringify(this.arrayContentSkins)} `;
    result.hash = Md5.hashStr(stringToHash);
    // result.hash = this.encrypt(stringToHash); //to do ogarnac zapisywanie hashow wiekszych niz varchar(250)
    result.nonce = this.nonce;

    let interval = setInterval(() => {
      this.transformX += this.transformX*this.transformValue/100;
      this.transformValue *= 0.88;
      this.delay *= 0.06;

    }, this.delay)

    setTimeout(async () => {
      clearInterval(interval);
      this.audioCaseOpen.play();
      const dialogRef = this.dialog.open(BoxDialog, {
        panelClass: 'my-class',
        data: {
          winnerSkin: winnerContentSkin
        }
      });
  
      let dataToSend = {
        id_user: 1,
        server_seed: this.serverSeed,
        user_seed: this.userSeed,
        nonce: result.nonce,
        hash: result.hash,
        item: JSON.stringify(winnerContentSkin)
      }
      await this.restService.addUserHistory(dataToSend).toPromise();
      this.nonce++;
      let dataToUpdate = {
        nonce: this.nonce
      }
      await this.restService.updateUserInformation(1, dataToUpdate).toPromise();
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result`);
        window.location.reload();
      });
    }, 8000);  
  }

  public encrypt(password: string) {
     return CryptoJS.DES.encrypt(password, this.apiKey).toString();
  }

  public decrypt(passwordToDecrypt: string) {
    return CryptoJS.DES.decrypt(passwordToDecrypt, this.apiKey).toString(CryptoJS.enc.Utf8);
 }

  public getTransform() {
    return `translateX(${this.transformX}%) translateZ(0%)`
  }

  async ngOnInit() {
    await this.getUserInformation();
    await this.getBoxInformation();
    await this.generateArray();
  }
}

@Component({
  selector: 'box-dialog',
  templateUrl: 'box-dialog.html',
  styleUrl: 'box-dialog.scss',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class BoxDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private restService: RestService) {}

  winnerSkin:any = {};
  skinInformation = {
    id: null,
    img: null,
    name: null,
    price: null,
    quality: null,
    weaponId: null
  };

  ngOnInit() {
    this.skinInformation = this.data.winnerSkin;
  }
}