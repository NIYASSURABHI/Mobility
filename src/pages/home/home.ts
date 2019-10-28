import { Component } from '@angular/core';
import { NavController,LoadingController,ModalController,AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { FormPage } from '../../pages/form/form';
//mport { SortPage } from '../../pages/sort/sort';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notes:any=[];
  order:any;

  constructor(public alrtctl:AlertController, private modalCtrl:ModalController, private loading:LoadingController, private sqlite: SQLite,public navCtrl: NavController) {

  }

  ionViewWillEnter(){

    this.get_data();
   
  }

  get_data(){

 

    let loader = this.loading.create({spinner: 'dots',});
    loader.present().then(() => {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM notes ORDER BY date DESC', [])
        .then(res => {

          console.log(res);
          loader.dismiss();
          for(var i=0; i<res.rows.length; i++) {
            this.notes.push({title:res.rows.item(i).title,description:res.rows.item(i).description,date:res.rows.item(i).date})
          }
         
        })
        .catch(e => {
          console.log(e);
          loader.dismiss();
          
        });
    }).catch(e => {
      console.log(e);
      loader.dismiss();
      
    });
  });

  }

  add_notes(){
    this.navCtrl.setRoot(FormPage);
  }

  sort_notes(){

    let alert = this.alrtctl.create({
      title: 'Sort Based on',
      inputs: [
        {
          type: 'radio',
          label: 'Title',
          value: '0'
        },
        {
          type: 'radio',
          label: 'Description',
          value: '1'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: (data:number) => {
            console.log('OK clicked: '+data );
            // I NEED TO GET THE VALUE OF THE SELECTED RADIO BUTTON HERE


            if(data==0){
              var result = this.notes.sort((a,b) => a.title > b.title ? 1 : -1)
              console.log(result);
            }
            else{
              var result =  this.notes.sort((a,b) => a.description > b.description ? 1 : -1)
              console.log(result);
            }
            // switch (data) {
            //   case 0:
            //       console.log("0");
            //       var result = this.notes.sort((a,b) => a.title > b.title ? 1 : 0)

            //       console.log(result);
                
            //     break;

            //   case 1:
              
            //     this.order=  this.notes.sort((a,b) => a.description > b.description ? 1 : 0)
            
            //    break;
            // }
          }
        }
      ]
    });
    alert.present();

  }

  removeItem(item){

    for(let i = 0; i < this.notes.length; i++) {

      if(this.notes[i] == item){
        this.notes.splice(i, 1);
        this.sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM notes WHERE date=?', [item.date])
          .then(res => {
            console.log(res);
            
          })
          .catch(e => console.log(e));
        }).catch(e => console.log(e));
      }

    }

}
}
