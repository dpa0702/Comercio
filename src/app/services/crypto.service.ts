import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
//   private key = CryptoJS.enc.Utf8.parse('E546C8DF278CD5931069B522E695D4F2'); // Chave de 32 bytes
//   private iv = CryptoJS.enc.Utf8.parse('A1B2C3D4E5F6G7H8'); // IV de 16 bytes

//   private key = CryptoJS.enc.Utf8.parse('27ABC036D04002682FE05CB19B5B01D1'); // Chave de 32 bytes
//   private iv = CryptoJS.enc.Utf8.parse('251ECBCF89D8A3C6'); // IV de 16 bytes

private key = CryptoJS.enc.Utf8.parse('032378E8E3ED949AF2DC2C46B96A5C09'); // Chave de 32 bytes
private iv = CryptoJS.enc.Utf8.parse('940D3B783F25790D'); // IV de 16 bytes

  encrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
}
