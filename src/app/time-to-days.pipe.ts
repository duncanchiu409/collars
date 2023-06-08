import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToDays'
})
export class TimeToDaysPipe implements PipeTransform {

  transform(value: number): string {
    let currentTime_in_miliseconds :number = new Date().valueOf()
    let value_in_miliseconds :number = value * 1000

    if(value_in_miliseconds >= currentTime_in_miliseconds){
      let seconds = (value_in_miliseconds - currentTime_in_miliseconds) / 1000
      let d = Math.floor(seconds / (3600*24))
      let h = Math.floor(seconds % (3600*24) / 3600)
      let m = Math.floor(seconds % 3600 / 60)
      let s = Math.floor(seconds % 60)

      let dDisplay = d > 0 ? d.toString() + (d == 1 ? " DAY " : " DAYS ") : "";
      let hDisplay = h > 0 ? h.toString() + (h == 1 ? " hour, " : " hours, ") : "";
      let mDisplay = m > 0 ? m.toString() + (m == 1 ? " minute, " : " minutes, ") : "";
      let sDisplay = s > 0 ? s.toString() + (s == 1 ? " second" : " seconds") : "";

      let h_added_zero = h >= 0 ? h < 10 ? '0' + h.toString() : h.toString() : ''
      let m_added_zero = m >= 0 ? m < 10 ? '0' + m.toString() : m.toString() : ''
      let s_added_zero = s >= 0 ? s < 10 ? '0' + s.toString() : s.toString() : ''
      return dDisplay + h_added_zero + ":" + m_added_zero + ':' + s_added_zero;
    }
    else{
      return "Invalid Value Parsed"
    }
  }

}
