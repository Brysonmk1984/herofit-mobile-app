import { getJwtInLocalStorage } from '../common/jwtModule';

interface restrictedHeader {
  headers : {
    Authorization: string
  },
  data : object | null | undefined,
  withCredentials: boolean
}

interface openHeader {
  withCredentials : boolean
}

type eitherHeader = restrictedHeader | openHeader


 async function axiosOptions() : eitherHeader{
  const jwtHeader = await getJwtInLocalStorage();
  console.log('JWT HEADER', jwtHeader);
  // If a non-expired JWT is saved locally, attach it to the request
  if(jwtHeader){
      return { headers : { Authorization : jwtHeader }, withCredentials : true };
  }else{
      return { withCredentials : true };
  }
}

async function axiosDeleteConfig(body){
  const jwtHeader = await getJwtInLocalStorage();
  return { headers : { Authorization : jwtHeader }, data : body  , withCredentials : true }
}

export { axiosOptions, axiosDeleteConfig };