import scrypt from 'scrypt-js'
import buffer from 'buffer'

exports.scrypt = function(password, salt, cb) {
	const _password = new buffer.SlowBuffer(password.normalize('NFKC'));
	const _salt 		= new buffer.SlowBuffer(salt.normalize('NFKC'));
	const N = 262144, r = 8, p = 1;
	const dkLen = 32;

	scrypt(_password, _salt, N, r, p, dkLen, cb)
}