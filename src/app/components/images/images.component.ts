import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { reject } from 'q';
import { UsersService } from '../../services/users.service';

const URL = 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  selectedFile: any;

  constructor(private userService: UsersService) {}

  ngOnInit() {}

  OnFileSelected(event) {
    const file: File = event[0];

    this.readAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  readAsBase64(file): Promise<any> {
    const reader = new FileReader(); // Refer FileReader
    const fileValue = new Promise((resolve, reject) => {
      // 'load' is a event
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', event => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });

    return fileValue;
  }

  upload() {
    if (this.selectedFile) {
      this.userService.addImage(this.selectedFile).subscribe(
        data => {
          console.log(data);
          const filePath = <HTMLInputElement>document.getElementById('filePath'); // To the value of html element
          filePath.value = ''; // To empty the value of file input
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
