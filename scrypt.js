var password = new buffer.SlowBuffer("anyPassword".normalize('NFKC'));
var salt = new buffer.SlowBuffer("someSalt".normalize('NFKC'));

var N = 1024, r = 8, p = 1;
var dkLen = 32;

scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
  if (error) {
    console.log("Error: " + error);

  } else if (key) {
    console.log("Found: " + key);

  } else {
    // update UI with progress complete
    updateInterface(progress);
  }
});