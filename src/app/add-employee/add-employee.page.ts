import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormatCurrencyService } from '../utils/format-currency.service';

const { v4: uuidv4 } = require('uuid');
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  @Input("from") from: any;
  form: FormGroup;
  submitted = false;
  defaultDate:any;  
  sal:any='';
  db:any;
  status= 0;
  navParam:any;
  employeeList:any=[];
  param:any;
  empName:any='';
  employeeData:any=[];
  departmentList =[
    {name:'Sales'},
    {name:'HR'},
    {name:'Finance'},
    {name:'Mobility and Cloud'},
    {name:'Admin'},
    {name:'Marketing'}];

  positions = [
    {title:'Developer'},
    {title:'Project Manager'},
    {title:'Marketing Manager'},
    {title:'HR Manager'},
    {title:'Administrative Assistant'},
    {title:'Finance Manager'}];

  constructor(
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public alertCtrl: AlertController,
    private sqlite: SQLite,
    public platform: Platform,
    private storage:Storage,
    private navCtrl:NavController,
    private router:Router,
    public  fc:FormatCurrencyService
    ) {
      this.param = this.router.getCurrentNavigation()?.extras?.state ?? {};
      this.storage.create();
      
     
    
  }
  ngOnInit() {
    this.employeeData = this.param.empData;
    if(this.employeeData){
      console.log("status 1");
      this.status = 1;
      this.form = this.formBuilder.group({
        empid:[this.employeeData.empid],
        name: [this.employeeData.name, [Validators.required]],
        dob: [this.employeeData.dob],
        nrc: [this.employeeData.nrc],
        department: [this.employeeData.department, [Validators.required]],
        position: [this.employeeData.position, [Validators.required]],
        salary: [this.employeeData.salary],
      });
      this.empName = this.employeeData.name;
      this.defaultDate = this.employeeData.dob;
      this.sal = this.fc.formatSalary(this.employeeData.salary);
    }
    else{
      console.log("status 0");
      this.status = 0;
      this.form = this.formBuilder.group({
        empid:[uuidv4()],
        name: [null, [Validators.required]],
        dob: [null],
        nrc: [null],
        department: [null, [Validators.required]],
        position: [null, [Validators.required]],
        salary: [this.sal],
      });
    }
   
  }
  

  saveDetails() {
    this.form.get('dob').setValue(this.defaultDate , {
      onlyself: true
   });
   
   if(this.sal != ""){
    this.sal = this.sal.toString().split(',').join('');
    console.log("sal1 >>"+this.sal);
 
    this.form.get('salary').setValue(this.sal , {
     onlyself: true
  });
   }
  
 console.log("saved Data >>> "+JSON.stringify(this.form.value));

    this.submitted = true;
    
    if (this.form.invalid) {
      return;
    }
  
    if (this.platform.is('ios')|| this.platform.is('android')){
      this.sqlite.create({
        name: "employeeDB",
        location: "default"
      }).then((db:SQLiteObject) => {
        this.db = db;
        this.db.executeSql("CREATE TABLE IF NOT EXISTS employeedata (empid TEXT PRIMARY KEY,name TEXT,dob TEXT,nrc TEXT,department TEXT,position TEXT,salary TEXT)", {}).then((data:any) => {
          let sqlText;
          let values:any;
          if(this.status == 0){
            sqlText = 'INSERT INTO employeedata(empid,name,dob,nrc,department,position,salary) VALUES(?,?,?,?,?,?,?)';
            values = [this.form.get('empid').value || null,this.form.get('name').value || null , this.form.get('dob').value || null, this.form.get('nrc').value || null ,this.form.get('department').value || null , this.form.get('position').value || null , this.form.get('salary').value || null]        
          }
         else{
            sqlText = "UPDATE employeedata SET (name , dob ,nrc , department , position , salary)  = (?,?,?,?,?,?) where empid = ? ; ";
            values = [this.form.get('name').value || null , this.form.get('dob').value || null, this.form.get('nrc').value || null ,this.form.get('department').value || null , this.form.get('position').value || null , this.form.get('salary').value || null, this.form.get('empid').value]        
         }
        
         this.db.executeSql(sqlText,values).then((result:any) => {
           console.log("Succesful >"+JSON.stringify(result));
        }, (error:any) => {
          console.error("cannot insert employee data" + JSON.stringify(error));
        });
          this.presentAlert();
        }, (error: any) => {
          console.error("Unable to create employee table", error);
        })
    });

    }
    else{
       this.storage.set("employeedata",this.form.value)
    }
    
    
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
  }
    
  async deleteData(){
    let deleteConfirm = await this.alertCtrl.create({
      header: "Are you sure you want to delete?",
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {           
                 this.deleteFromDB();
          }
        }
      ]
    });  
    deleteConfirm.present();  
  }


  deleteFromDB(){
    this.sqlite.create({
      name: "employeeDB",
      location: "default"
    }).then((db:SQLiteObject) => { 
      this.db = db;
      let sqlText;
      let values ;
      sqlText = `DELETE from employeedata where empid = ? `;
      values = [this.form.get('empid').value || null ] 
      this.db.executeSql(sqlText,values).then((result:any) => {
        console.log("deleted Succesfully >"+JSON.stringify(result));
        // setTimeout(() => {
          this.navCtrl.pop();
        // },1000);
     }, (error:any) => {
       console.error("cannot delete employee data" + JSON.stringify(error));
     });
    });
      
  }


  async presentAlert() {
    const alert = await this.alertCtrl.create({
      message: (this.status == 0)?'Saved Successfully!':'Updated Successfully!',
      backdropDismiss:false,
      buttons:  [{
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.navCtrl.pop();
        },
      }],
      
    });

    await alert.present();
  }
  getDate(dt:any) {
    console.log("value>>"+dt.target.value);
    // let date = new Date(dt.target.value).toISOString().substring(0, 10);
    let date = dt.target.value;
    this.defaultDate = date.substring(8,10) + "/" + date.substring(5, 7) + "/" + date.substring(0,4);;
    this.form.get('dob').setValue(this.defaultDate , {
       onlyself: true
    });
    console.log("dob >"+this.form.get('dob').value)
 }

  onReset() {
    this.submitted = false;
    this.form.reset();
    this.navCtrl.pop();
  }

  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    let day, month, year, todaydate;
    if (Number(dd) < 10) {
      day = '0' + String(dd);
    } else {
      day = String(dd);
    }
    if (Number(mm) < 10) {
      month = '0' + String(mm);
    } else {
      month = String(mm);
    }
    year = String(yyyy);
    todaydate = day + '/' + month + '/' + year;
    console.log(String(todaydate));
    return String(todaydate);
  }

  formatSalary(valString:any) {
    return this.fc.formatSalary(valString);
  };
  }

