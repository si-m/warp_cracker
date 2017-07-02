import CoinKey 	from 'coinkey'
import scrypt 	from 'scrypt'
import buffer 	from 'buffer'
import binascii from 'binascii'
import pbkdf2   from 'pbkdf2'

const xorOutput = "df2979eee8ee1989fd335736ccf3828d5b982032cf1ed852d6a535227efcedc8"
const target_pub = '1MkupVKiCik9iyfnLrJoZLx9RH4rkF3hnA'

function op_xor(a, b) {
  if (!Buffer.isBuffer(a)) a = new Buffer(a)
  if (!Buffer.isBuffer(b)) b = new Buffer(b)
  var res = []
  if (a.length > b.length) {
    for (var i = 0; i < b.length; i++) {
       res.push(a[i] ^ b[i])
    }
 } else {
 for (var i = 0; i < a.length; i++) {
   res.push(a[i] ^ b[i])
   }
 }
 return new Buffer(res);
}

const randomPassphrase = () => {
    let result = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 8;
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}




let interation = 0
let passphrase = randomPassphrase()
console.log('Starting...')
console.log('Try number: ', interation)
console.log('passphrase: ', passphrase.toString('hex'))
let startTime = Date.now()
let s1 = scrypt.hashSync(new Buffer(passphrase + "\x01"), {"N":262144,"r":8,"p":1}, 32, new Buffer("a@b.c"+"\x01"))
let	s2 = pbkdf2.pbkdf2Sync(new Buffer(passphrase + "\x02"), new Buffer("a@b.c"+"\x02"), 65536, 32, 'sha256')
let merge = op_xor(s1,s2).toString('hex')
let key = new CoinKey(new Buffer(merge, 'hex'))
key.compressed = false
console.log('Private key: ',key.privateWif)
console.log('Public key: ',key.publicAddress)
console.log('Work time: '+ (Date.now() - startTime) + 'ms' )

while(key.publicAddress != '1MkupVKiCik9iyfnLrJoZLx9RH4rkF3hnA'){
	let passphrase = randomPassphrase()
	console.log('Try number: ', interation)
	console.log('passphrase: ', passphrase.toString('hex'))
	startTime = Date.now()
	s1 = scrypt.hashSync(new Buffer(passphrase + "\x01"), {"N":262144,"r":8,"p":1}, 32, new Buffer("a@b.c"+"\x01"))
	s2 = pbkdf2.pbkdf2Sync(new Buffer(passphrase + "\x02"), new Buffer("a@b.c"+"\x02"), 65536, 32, 'sha256')
	merge = op_xor(s1,s2).toString('hex')
	key = new CoinKey(new Buffer(merge, 'hex'))
	key.compressed = false
	console.log('Private key: ',key.privateWif)
	console.log('Public key: ',key.publicAddress)
	console.log('Work time: '+ (Date.now() - startTime) + 'ms' )
	interation += 1
}



