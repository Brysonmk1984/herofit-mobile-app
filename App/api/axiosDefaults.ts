import _axios from 'axios';

interface restrictedHeader {
  headers : {
    Authorization: string
  },
  withCredentials: boolean
}

interface openHeader {
  withCredentials : boolean
}

type eitherHeader = restrictedHeader | openHeader

const axiosOptions = function(jwt?: string) : eitherHeader{
  if(jwt){
      return { headers : { Authorization : `Bearer ${ jwt }` }, withCredentials:true };
  }else {
      return { withCredentials:true };
  }
}

export { axiosOptions };
