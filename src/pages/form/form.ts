import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HomePage } from '../home/home';


/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {

 private logform: FormGroup;


  constructor(public alert:AlertController, private sqlite: SQLite,public navCtrl: NavController, private formBuilder: FormBuilder, public navParams: NavParams) {

    this.logform = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])]
     });
    }

 
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPages');
  }

  cancel(){

  }

  mob_submit(val){

    console.log(val);
    val.date=new Date();
    this.save_data(val);
    

  }

  save_data(val){

    console.log(val);

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO notes VALUES(?,?,?)',[val.title,val.description,val.date])
        .then(res => {
          console.log(res);
          this.alert_open();
         
        })
        .catch(e => {
          console.log(e);
         
        });
    }).catch(e => {
      console.log(e);
      
    });

  }

  alert_open(){
    let alert = this.alert.create({
      title: 'Note Added',
      message: 'Note Added successfully',
      buttons: [
       
        {
          text: 'OK',
          handler: () => {
            console.log(' clicked');
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

}
