import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MatDialog } from '@angular/material';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title = 'To-Do-List';
  myDataArray: Observable<ITodoItem[]>;
  myPersonArray: Observable<IPerson[]>;
  matRow = ['id', 'assigned', 'description', 'done', 'edit', 'delete'];
  assigned = false;
  notDone = false;
  user;
  newAssignment;
  newDescription;
  showForm = false;
  editId;


  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.loadPeople();
    this.loadList();
  }

  loadList() {
    this.myDataArray = this.http.get<ITodoItem[]>('http://localhost:8080/api/todos');
  }

  loadPeople() {
    this.myPersonArray = this.http.get<IPerson[]>('http://localhost:8080/api/people');
  }

  filterToDos() {
    if (this.assigned === true && this.notDone === true) {
      this.myDataArray = this.http.get<ITodoItem[]>('http://localhost:8080/api/todos').
        map(todo => todo.filter(element => element.assignedTo === this.user && element.done === false));
    } else {
      if (this.assigned && this.notDone === false) {
        this.myDataArray = this.http.get<ITodoItem[]>('http://localhost:8080/api/todos').
          map(todo => todo.filter(element => element.assignedTo === this.user));
      } else {
        if (this.assigned === false && this.notDone) {
          this.myDataArray = this.http.get<ITodoItem[]>('http://localhost:8080/api/todos').
            map(todo => todo.filter(element => element.done === false));
        } else {
          this.myDataArray = this.http.get<ITodoItem[]>('http://localhost:8080/api/todos');
        }
      }
    }
  }

  showAddForm(){
    if(this.showForm){
      this.showForm = false;
    }else{
      this.showForm = true;
    }
  }

  openDialog(id){
    this.editId = id;
    document.getElementById('myModal').style.display = 'block';
  }

  addToDo(){
      this.http.post<ITodoItem>('http://localhost:8080/api/todos', {
        "description": this.newDescription,
        "assignedTo": this.newAssignment
      }).subscribe(
        (val) => {
          //action successful
          //TODO: refresh page
          this.loadList();
        });
      
      this.showForm = false;
  }

  deleteToDo(id){
    this.http.delete('http://localhost:8080/api/todos/' + id).subscribe((val) => {
      //action successful
      //TODO: refresh page
      this.loadList();
    });
  }

  updateToDo(){
    this.http.patch('http://localhost:8080/api/todos/' + this.editId, {
      "description": this.newDescription
    }).subscribe((val) => {
      //action successful
      //TODO: refresh page
      this.loadList();
    });
    document.getElementById('myModal').style.display = 'none';
  }

  changeDoneFlag(check, id){
    if (check.checked) {
      this.http.patch('http://localhost:8080/api/todos/' + id, {
        'done': true,
      }).subscribe((val) =>{
        //this.loadList();
      });

    } else {
      this.http.patch('http://localhost:8080/api/todos/' + id, {
        'done': false,
      }).subscribe((val) =>{
        //this.loadList();
      });

    }
  }
  
}

interface IPerson {
  name: string;
}

interface ITodoItem {
  id: number;
  assignedTo?: string; //Bei einem ? muss die Variable keinen Wert bekommen!
  description: string;
  done?: boolean
}
