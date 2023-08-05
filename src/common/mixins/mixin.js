import moment from "jalali-moment";

export const convertDate = (date , format)=>{
  const converted_date = moment(date).locale("fa").format(format);
  return converted_date
}


export const dateToTimeStamp = (date) =>{
    const timeStamp = new Date(date).getTime()
    return timeStamp
}