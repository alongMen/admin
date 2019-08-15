export const parsePrice = (s) => {
    let n = 2  //设置保留的小数位数
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse();
    let r = s.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
    t += l[i];
    }
    return t.split("").reverse().join("") + "." + r;
};