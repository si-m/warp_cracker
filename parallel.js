import CoinKey from 'coinkey'
import scrypt from 'scrypt'
import buffer from 'buffer'
import binascii from 'binascii'
import pbkdf2 from 'pbkdf2'
import fs from 'fs'
import { op_xor } from './lib/helpers'
import { randomPassphrase } from './lib/helpers'
import async from 'async';

exports.crack = () => {
	let interation = 0
	let key = { publicAddress: 0 }
	let passphrase = ''
	const target_pub = '1MkupVKiCik9iyfnLrJoZLx9RH4rkF3hnA'
	console.log('Starting...')

	async.during(
		function(callback) {
			return callback(null, target_pub !== key.publicAddress);
		},
		function(callback) {
			passphrase = randomPassphrase()
			console.log('Try number: ', interation)
			console.log('Passphrase: ', passphrase.toString('hex'))

			//timer start
			const startTime = Date.now()

			async.parallel({
				one: function(callback) {
					scrypt.hash(new Buffer(passphrase + "\x01"), { "N": 262144, "r": 8, "p": 1 }, 32, new Buffer("a@b.c" + "\x01"), (err, result) => {
						callback(null, result)
					})
				},
				two: function(callback) {
					pbkdf2.pbkdf2(new Buffer(passphrase + "\x02"), new Buffer("a@b.c" + "\x02"), 65536, 32, 'sha256', (err, result) => {
						callback(null, result)
					})

				}
			}, function(err, results) {
				
				//xor s1 and s2 and gen bitcoin address 
				key = new CoinKey(op_xor(results.one, results.two))
				key.compressed = false

				console.log('Public key: ', key.publicAddress)
				console.log('Privatekey: ', key.privateWif)
				console.log('Work  time:  ' + (Date.now() - startTime) + 'ms')
				console.log('-----------------------------------------------')
				interation += 1
				callback()
			})
		},
		function(err) {
			console.log("SUCCESS!")
			console.log('Passphrase: ', passphrase.toString('hex'))
			console.log('Private key: ', key.privateWif)

			const success_text = 'Passphrase: ' + passphrase.toString('hex') + '\n' + 'Private key: ' + key.privateWif + '\n' + 'Public key: ' + key.publicAddress
			fs.writeFile("success.txt", success_text, (err) => {
				if (err) console.log(err)
				console.log("The file was saved!")
			})
		}
	)
}
