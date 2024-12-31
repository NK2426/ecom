import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private messages: string[] = [];
  private toastrConfig: Message = {
    closable: true,
    life: 3000
  };

  constructor(private toastr: MessageService) { }

  public add(message: string): void {
    this.messages.push(message);
    this.toastr.add({ ...this.toastrConfig, detail: message, severity: 'success', summary: 'Success' });
  }

  public addError(message: string): void {
    this.toastr.add({ ...this.toastrConfig, detail: message, severity: 'error', summary: 'Error' });
  }

  public addWarn(message: string): void {
    this.toastr.add({ ...this.toastrConfig, detail: message, severity: 'warn', summary: 'Warning' });
  }

  public clear(): void {
    this.messages = [];
  }
}
