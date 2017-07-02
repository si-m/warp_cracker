import CoinKey 	from 'coinkey'
import scrypt 	from 'scrypt'
import buffer 	from 'buffer'
import binascii from 'binascii'
import pbkdf2   from 'pbkdf2'
import fs 			from 'fs'

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

exports.crack = () => {
	let interation = 0
	let key = {publicAddress: 0}
	let passphrase = ''
	const target_pub = '1MkupVKiCik9iyfnLrJoZLx9RH4rkF3hnA'
	console.log('Starting...')
	while(target_pub !== key.publicAddress){
		passphrase = randomPassphrase()
		console.log('Try number: ', interation)
		console.log('passphrase: ', passphrase.toString('hex'))
		const startTime = Date.now()
		const s1 = scrypt.hashSync(new Buffer(passphrase + "\x01"), {"N":262144,"r":8,"p":1}, 32, new Buffer("a@b.c"+"\x01"))
		const s2 = pbkdf2.pbkdf2Sync(new Buffer(passphrase + "\x02"), new Buffer("a@b.c"+"\x02"), 65536, 32, 'sha256')
		const merge = op_xor(s1,s2).toString('hex')
		key = new CoinKey(new Buffer(merge, 'hex'))
		key.compressed = false
		console.log('Private key: ',key.privateWif)
		console.log('Public key: ',key.publicAddress)
		console.log('Work time: '+ (Date.now() - startTime) + 'ms' )
		interation += 1
	}

	console.log("SUCCESS!")
	console.log('Passphrase: ', passphrase.toString('hex'))
	console.log('Private key: ',key.privateWif)

	const success = 'Passphrase: ' + passphrase.toString('hex') + '\n'+ 'Private key: ' + key.privateWif + '\n' +'Public key: ' + key.publicAddress
	fs.writeFile("success.txt", success, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!")
	}) 
}

