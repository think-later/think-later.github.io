"use strict";

function strToBytes(str) {
  return str.split("").map((c) => c.charCodeAt());
}

function containsUtf16(bytes) {
  return !bytes.every((c) => c < 0xff);
}

async function encode(obj) {
  const str = JSON.stringify(obj);
  const bytes = strToBytes(str);
  const isUtf16String = containsUtf16(bytes);
  const byteArray = isUtf16String
    ? Uint16Array.from(bytes)
    : Uint8Array.from(bytes);
  const result = window.pako.deflate(
    new Uint8Array(byteArray.buffer, byteArray.byteOffset, byteArray.byteLength)
  );
  const blob = bytesToBase64(result);
  console.log("JSON object:", str);
  console.log("Blob       :", blob);
  return Promise.resolve({
    encodedData: blob,
    isUtf16String: isUtf16String,
  });
}

async function decode(data64, isUtf16String) {
  const compressed = base64ToBytes(data64);
  const uncompressed8 = window.pako.inflate(compressed);
  const uncompressed = isUtf16String
    ? new Uint16Array(
        uncompressed8.buffer,
        uncompressed8.byteOffset,
        uncompressed8.byteLength / 2
      )
    : uncompressed8;
  return Promise.resolve(
    JSON.parse(String.fromCharCode.apply(null, uncompressed))
  );
}
