exports.op_xor = (a, b) => {
  if (!Buffer.isBuffer(a)) a = new Buffer(a)
  if (!Buffer.isBuffer(b)) b = new Buffer(b)
  const res = []
  if (a.length > b.length) {
    for (let i = 0; i < b.length; i++) {
       res.push(a[i] ^ b[i])
    }
 } else {
 for (let i = 0; i < a.length; i++) {
   res.push(a[i] ^ b[i])
   }
 }
 return new Buffer(res);
}


exports.randomPassphrase = () => {
    let result = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 8;
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}