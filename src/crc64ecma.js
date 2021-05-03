// https://github.com/glenmurphy/crc64
var crc64ecma_table = [];
var mask8 = 0xFFFFFFFFFFFFFFFFn;

function generateEcmaTable() {
  if (crc64ecma_table.length) return;

  var c = 0n, crc = 0n;

  for (var i = 0n; i < 256n; i++) {
    crc = 0n;
    c = i << 56n;

    for (var j = 0; j < 8; j++) {
      if ((crc ^ c) & 0x8000000000000000n)
        crc = (crc << 1n) ^ 0x42F0E1EBA9EA3693n; // ECMA182 Polynomial
      else
        crc <<= 1n;
      c <<= 1n;
    }

    crc64ecma_table[i] = crc & mask8;
  }
}

function crc64ecma(str) {
  generateEcmaTable();
  str = unescape(encodeURIComponent(str)); // convert to UTF8
  
  var crc = 0n;
  for (var i = 0; i < str.length; i++) {
    var byte56 = BigInt(str.charCodeAt(i) & 0xFF) << 56n;
    crc ^= byte56;
    var index = (crc >> 56n) & 0xFFn;
    crc = ((crc << 8n) ^ crc64ecma_table[index]) & mask8;
  }

  if (!crc) return '';
  
  return crc.toString(16);
}