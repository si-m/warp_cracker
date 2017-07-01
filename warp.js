var CoinKey = require('coinkey')


var xorOutput = "df2979eee8ee1989fd335736ccf3828d5b982032cf1ed852d6a535227efcedc8"

//Bitcoin WIF 
while(true){
	var key = new CoinKey(new Buffer(xorOutput, 'hex'))
	key.compressed = false
	console.log(Date.now())
	console.log(key.privateWif)
}


