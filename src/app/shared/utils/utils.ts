

import { HttpResponse, HttpEventType } from '@angular/common/http';
import fileType from 'file-type';

type ComparableKeys = number | boolean | string;

export class Generic {
  static isNullOrUndefined<T>(v: T): boolean {
    return v === null || v === undefined;
  }

  static coalesce<T>(...vals: Array<any>): T {
    let result = null;
    if (vals) {
      let i = 0;
      while (result === null && i < vals.length) {
        if (vals[i] !== null && vals[i] !== undefined) {
          result = vals[i];
        }
        i++;
      }
    }
    return result;
  }

  static clone<T>(value: T): T {
    if (value === null || value === undefined) {
      return value;
    }
    return JSON.parse(JSON.stringify(value));
  }
}

export class Strings {
  static isNotEmpty(cad: string | number): boolean {
    return !Generic.isNullOrUndefined(cad) && `${cad}`.trim() !== '';
  }

  static isEmpty(cad: string | number): boolean {
    return Generic.isNullOrUndefined(cad) || `${cad}`.trim() === '';
  }

  static trim(cad: string | number): string {
    if (!Generic.isNullOrUndefined(cad)) {
      return `${cad}`.trim();
    }
    return '';
  }

  static ltrim(cad: string, char = ' '): string {
    if (cad) {
      if (char && char.length > 0) {
        const charAux = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regEx = new RegExp(`^(${charAux})*`);
        return cad.replace(regEx, '');
      }
      return cad.replace(/^\s*/gm, '');
    }
    return '';
  }

  static rtrim(cad: string, char = ' '): string {
    if (cad) {
      if (char && char.length > 0) {
        const charAux = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regEx = new RegExp(`(${charAux})*$`);
        return cad.replace(regEx, '');
      }
      return cad.replace(/\s*$/gm, '');
    }
    return '';
  }

  static lowerCase(cad: string): string {
    if (cad) {
      return cad.toLowerCase();
    }
    return '';
  }

  static upperCase(cad: string): string {
    if (cad) {
      return cad.toUpperCase();
    }
    return '';
  }

  static capitalize(cad: string): string {
    if (cad) {
      const trimmedCad = cad.trim();
      if (trimmedCad.length > 1) {
        return (
          trimmedCad.substr(0, 1).toUpperCase() +
          trimmedCad.substr(1).toLowerCase()
        );
      }
      return trimmedCad.toUpperCase();
    }
    return '';
  }

  static removeAccents(cad: string): string {
    if (cad) {
      return cad.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return '';
  }

  static prepareForSearch(cad: string | number): string {
    if (cad) {
      return Strings.lowerCase(Strings.removeAccents(Strings.trim(`${cad}`)));
    }
    return '';
  }
}

export class Arrays {
  static toArray<T>(val: T | Array<T>): Array<T> {
    if (val === null || val === undefined) {
      return [];
    }
    return Array.isArray(val) ? [...val] : [val];
  }

  static isArray<T>(x: Array<T> | any): x is Array<T> {
    return (Array.isArray && Array.isArray(x)) && (x && typeof x.length === 'number');
  }

  static mapByField<T1, K extends keyof T1>(x: Array<T1>, key: K): Array<T1[K]> {
    if (Generic.isNullOrUndefined(x)) {
      return [];
    }
    if (Generic.isNullOrUndefined(key)) {
      return [];
    }
    return x.map(p => p[key]);
  }

  static sortByField<T1, K extends keyof T1, F extends T1[K] & ComparableKeys>(
    x: Array<T1>,
    key: K,
    order: 'ASC' | 'DESC' = 'ASC'): Array<T1> {

    if (Generic.isNullOrUndefined(x) || x.length === 0) {
      return [];
    }
    if (Generic.isNullOrUndefined(key)) {
      return x;
    }

    let keyComparatorFn: (a: T1[K], b: T1[K]) => number;
    keyComparatorFn = (a: T1[K], b: T1[K]): number => {
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    };

    let compareFn: (a: T1, b: T1) => number;
    compareFn = (a: T1, b: T1): number => {
      let res = keyComparatorFn(a[key], b[key]);
      if (order === 'DESC') {
        res = res * -1;
      }
      return res;
    };
    return x.sort(compareFn);
  }

  static isEmpty<T>(arr: Array<T>): boolean {
    return !arr || arr.length === 0;
  }

  static isNotEmpty<T>(arr: Array<T>): boolean {
    return arr && arr.length > 0;
  }

  static nullSafe<T>(arr: Array<T>): Array<T> {
    if (Generic.isNullOrUndefined(arr)) {
      return [];
    }
    return arr;
  }

  static size<T>(arr: Array<T>): number {
    if (Generic.isNullOrUndefined(arr)) {
      return 0;
    }
    return arr.length;
  }

  static forEach<T>(arr: Array<T>, callbackfn: (value: T, index: number, array: Array<T>) => void): void {
    if (!Generic.isNullOrUndefined(arr)) {
      arr.forEach(callbackfn);
    }
  }

  static join<T>(arr: Array<T>, glue = ', '): string {
    if (Generic.isNullOrUndefined(arr) || Arrays.isEmpty(arr)) {
      return '';
    }
    return arr.join(glue);
  }

  static intersection<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA.filter(x => arrB.includes(x));
  }

  static difference<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA.filter(x => !arrB.includes(x));
  }

  static symetricalDifference<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA
      .filter(x => !arrB.includes(x))
      .concat(arrB.filter(x => !arrA.includes(x)));
  }

  static union<T>(val1: T | Array<T>, ...vals: Array<T | Array<T>>): Array<T> {
    let arrA: Array<T> = Arrays.toArray(val1);
    if (vals && vals.length > 0) {
      vals.forEach(arr => {
        const arrB: Array<T> = Arrays.toArray(arr);
        arrA = arrA.concat(arrB.filter(x => !arrA.includes(x)));
      });
    }

    return arrA;
  }

  static containsAll<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (!arr || !value) {
      return false;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsAll = true;
      value.forEach((val: T) => {
        containsAll = containsAll && arr.includes(val);
      });
      return containsAll;
    }
    return arr.includes(value);
  }

  static containsAny<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (!arr || !value) {
      return false;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsAny = false;
      value.forEach((val: T) => {
        containsAny = containsAny || arr.includes(val);
      });
      return containsAny;
    }
    return arr.includes(value);
  }

  static containsNone<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (arr === null || arr === undefined) {
      return false;
    } else if (arr.length === 0 || !value) {
      return true;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsNone = true;
      value.forEach((val: T) => {
        containsNone = containsNone && !arr.includes(val);
      });
      return containsNone;
    }
    return !arr.includes(value);
  }

  static loop(numElements: number): Array<number> {
    if (numElements === null || numElements === undefined || numElements <= 0) {
      return [];
    }

    const result = [];
    for (let i = 0; i < numElements; i++) {
      result.push(i);
    }

    return result;
  }

  static range(start?: number, stop?: number, step = 1): Array<number> {
    let startAux = start;
    let stopAux = stop;
    if (typeof stopAux === 'undefined') {
      // one param defined
      stopAux = startAux;
      startAux = 0;
    }

    if (step === 0) {
      return [startAux];
    }

    if ((step > 0 && startAux > stopAux) || (step < 0 && startAux < stopAux)) {
      return [];
    }

    const result = [];
    for (let i = startAux; step > 0 ? i < stopAux : i > stopAux; i += step) {
      result.push(i);
    }

    return result;
  }
}

export class Booleans {
  static and(...vals: Array<boolean | Array<boolean>>): boolean {
    if (Arrays.isEmpty(vals)) {
      return false;
    }
    const arr: Array<boolean> = (Arrays.isArray(vals[0])
      ? vals[0] as Array<boolean>
      : Arrays.toArray(vals as Array<boolean>));

    let res = null;
    if (arr && arr.length > 0) {
      arr.forEach(b => {
        if (b !== null && b !== undefined && typeof b === 'boolean') {
          res = (res === null ? b : res && b);
        }
      });
    }
    return (res !== null ? res : false);
  }

  static or(...vals: Array<boolean | Array<boolean>>): boolean {
    if (Arrays.isEmpty(vals)) {
      return false;
    }
    const arr: Array<boolean> = (Arrays.isArray(vals[0])
      ? vals[0] as Array<boolean>
      : Arrays.toArray(vals as Array<boolean>));

    let res = null;
    if (arr && arr.length > 0) {
      arr.forEach(b => {
        if (b !== null && b !== undefined && typeof b === 'boolean') {
          res = (res === null ? b : res || b);
        }
      });
    }
    return (res !== null ? res : false);
  }

  static xor(val1: boolean | number, val2: boolean | number): boolean {
    return (!val1 != !val2);
  }
}

export class Flow {
  static executeNTimes(iterations: number, callbackfn: (iteration: number) => void): void {
    if (!callbackfn) {
      return;
    }
    for (let i = 0; i < iterations; i++) {
      callbackfn(i);
    }
  }
}

export class Numbers {
  private static preFilterArray(...nums: Array<number> | Array<Array<number>>): Array<number> {
    if (Generic.isNullOrUndefined(nums)) {
      return null;
    }

    const filteredArray: Array<number> = ((Arrays.isArray(nums[0]) ? nums[0] : nums) as Array<number>)
      .filter((v: number) => v !== null && v !== undefined);

    if (Arrays.isEmpty(filteredArray)) {
      return null;
    }

    return filteredArray;
  }

  static isNumber(val: any): val is number {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat
    return !Arrays.isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }

  static toNumber(val: any): number {
    if (Numbers.isNumber(val)) {
      return Number(val);
    }
    return null;
  }

  static sum(...nums: Array<number> | Array<Array<number>>): number {
    const filteredArray = Numbers.preFilterArray(...nums);
    if (Arrays.isEmpty(filteredArray)) {
      return 0;
    }

    return filteredArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
  }

  static min(...nums: Array<number> | Array<Array<number>>): number {
    const filteredArray = Numbers.preFilterArray(...nums);
    if (Arrays.isEmpty(filteredArray)) {
      return null;
    }
    return filteredArray.reduce((a, b) => a < b ? a : b);
  }

  static max(...nums: Array<number> | Array<Array<number>>): number {
    const filteredArray = Numbers.preFilterArray(...nums);
    if (Arrays.isEmpty(filteredArray)) {
      return null;
    }
    return filteredArray.reduce((a, b) => a > b ? a : b);
  }

  static avg(...nums: Array<number> | Array<Array<number>>): number {
    const filteredArray = Numbers.preFilterArray(...nums);
    if (Arrays.isEmpty(filteredArray)) {
      return null;
    }
    return filteredArray.reduce((accumulator, currentValue) => accumulator + currentValue) / filteredArray.length;
  }

  static lerp(a: number, b: number, t: number): number {
    return (a * (1 - t)) + (b * t);
  }

  static lpad(num: number, size: number): string {
    let s = `${num}`;
    while (s.length < size) {
      s = `0${s}`;
    }
    return s;
  }
}

export class Password {
  static getPasswordCorrecto(): RegExp {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;
  }
}
export class Emails {
  static getRegexForEmailAragon(): RegExp {
    return /^\w+@aragon.es$/;
  }

  static getRegexForEmailExtAragon(): RegExp {
    return /^(ams|amm|amm1)\.\w+@ext.aragon.es$/;
  }

  static getRegexForEmailDefault(): RegExp {
    return /^(\w+\.)+@([a-zA-Z_]+?\.){1,2}[a-zA-Z]{2,4}$/;
  }

  static getRegexForEmailRFC(): RegExp {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  }

  static getRegexForEmailW3CStandar(): RegExp {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  }

  static getRegexForEmailWithName(): RegExp {
    return /^((?:"[^<>]+")|(?:[^<>]+))[ ]+<((?:[\w+\.]+)@(?:[a-zA-Z_]+?\.){1,2}[a-zA-Z]{2,4})>$/;
  }

  static getDataFromEmailWithName(value: string): [string, string] {
    if (!Emails.getRegexForEmailWithName().test(value)) {
      return null;
    }
    const res = Emails.getRegexForEmailWithName().exec(value);
    return [res[1], res[2]];
  }
}

export class Files {
  static FRAME_DOWNLOAD_ID = 'download-frame';

  // TODO: fileType library causing application not to work in IE!
  static base64ToFile(encodedString: string, filename: string): File {
    const bytes = atob(encodedString);
    const binaryData = [];
    for (let i = 0; i < bytes.length; i++) {
      binaryData.push(bytes.charCodeAt(i));
    }

    const uint8array: Uint8Array = new Uint8Array(binaryData);
    const mimeType = fileType(uint8array); // TODO: fileType library causing application not to work in IE!

    const filePropertyBag: FilePropertyBag = {};
    filePropertyBag.type = mimeType ? mimeType.mime : 'octet/stream';
    return new File([uint8array], filename, filePropertyBag);
  }

  // TODO: fileType library causing application not to work in IE!
  static base64ToBlob(encodedString: string, filename: string): Blob {
    const bytes = atob(encodedString);
    const binaryData = [];
    for (let i = 0; i < bytes.length; i++) {
      binaryData.push(bytes.charCodeAt(i));
    }

    const uint8array: Uint8Array = new Uint8Array(binaryData);
    const mimeType = fileType(uint8array); // TODO: fileType library causing application not to work in IE!

    const filePropertyBag: FilePropertyBag = {};
    filePropertyBag.type = mimeType ? mimeType.mime : 'octet/stream';

    const blob = new Blob([uint8array], filePropertyBag);
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    }
    return blob;
  }

  static createAndDownloadBlobFile(body: BlobPart, options: BlobPropertyBag, filename: string): void {
    const blob = new Blob([body], options);
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  static saveBlobAsFile(data: HttpResponse<any> | BlobPart, dataType: HttpEventType.Response | string, filename: string): void {
    let blob: Blob;
    if (data instanceof HttpResponse) {
      const binaryData = [];
      binaryData.push(data.body);

      blob = new Blob(binaryData, { type: `${dataType}` });
    } else {
      blob = new Blob([data], { type: `${dataType}` });
    }

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = window.URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  static downloadFromUrl(url: string): void {
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Not working well in IE11, Security Exception opening the iframe
   */
  static downloadFromUrlAsIFrame(url: string): void {
    const iframe = document.createElement('iframe');

    if (document.getElementById(Files.FRAME_DOWNLOAD_ID)) {
      const element = document.getElementById(Files.FRAME_DOWNLOAD_ID);
      if (element.remove) {
        element.remove();
      } else {
        element.parentNode.removeChild(element);
      }
    }
    iframe.style.visibility = 'hidden';
    iframe.setAttribute('id', Files.FRAME_DOWNLOAD_ID);
    iframe.setAttribute('src', url);
    document.body.appendChild(iframe);
  }
}
