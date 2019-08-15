import moment from 'moment';

export const formatBeijingDate = str => {

  if(!str){
    return '';
  }

  const localTime = moment.utc(str).toDate();

  return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
};
