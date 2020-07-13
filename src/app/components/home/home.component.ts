import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../shared/services/users.service';
import { DocumentosService } from 'src/app/shared/services/documentos.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuarios;
  file: File;
  resultado;

  successMessage: string = null;
  errorMessage: string = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly documentosService: DocumentosService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly uiService: UiService,

  ) {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log("ngOnInit");
  }



  fileChanged($event: any): void {
    if ($event.target && $event.target.files.length > 0) {
      this.file = $event.target.files[0];
    } else {
      delete this.file;
    }
  }



  adjuntar(event: any): void {
    this.uiService.showSpinner('cargando');

    if (!this.file) {
      console.log(event);
      this.errorMessage = "Debe seleccionar un archivo";
      this.uiService.hideSpinner();

    } else {
      this.documentosService.addDoc(this.file).then(result => {
        this.resultado = result;
        console.log('resp', this.resultado);
      }).catch((err: string) => {
        this.errorMessage = err;
        console.log(err);
      }).finally(() => {
      });
      this.successMessage = 'Se proceso el archivo correctamente';
      this.uiService.hideSpinner();


    }
  }

}
