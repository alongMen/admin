export const validBankCard = (rule, value, cb) => {
  const rep = /^(\d{16}|\d{19})$/;
  if (!rep.test(value)) {
    cb(new Error('银行卡号为16位或19位数字'));
  } else {
    cb();
  }
};

export const validMobile = (rule, value, cb) => {
  const reg = /^1\d{10}$/;
  if (!reg.test(value)) {
    cb(new Error('请输入正确手机号码'));
  } else {
    cb();
  }
};

export const validMobileNoRequired = (rule, value, cb) => {
  const reg = /^1\d{10}$/;
  if (!value) {
    cb();
  } else if (!reg.test(value)) {
    cb(new Error('请输入正确手机号码'));
  } else {
    cb();
  }
};

export const validcode = (rule, value, cb) => {
  const rep = /^\d{6}$/;
  if (value && !rep.test(value)) {
    cb(new Error('验证码为6位纯数字'));
  } else {
    cb();
  }
};

export const validUserName = (rule, value, callback) => {
  if (value) {
    if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error('账号不能为汉字!'));
    } else {
      callback();
    }
  }
  callback();
};

export const validip = (rule, value, cb) => {
  const rep = /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/;
  if (!rep.test(value)) {
    cb(new Error('ip地址格式错误'));
  } else {
    cb();
  }
};

export const validDomain = (rule, value, cb) => {
  const rep = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  if (!rep.test(value)) {
    cb(new Error('域名格式错误'));
  } else {
    cb();
  }
};

export const validDomainNoRequired = (rule, value, cb) => {
  const rep = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  if (!value) {
    cb();
  } else if (!rep.test(value)) {
    cb(new Error('域名格式错误'));
  } else {
    cb();
  }
};

export const validUrl = (rule, value, cb) => {
  const rep = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (!rep.test(value)) {
    cb(new Error('链接格式错误'));
  } else {
    cb();
  }
};
