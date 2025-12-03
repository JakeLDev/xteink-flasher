'use server';

const urls = {
  '3.1.0-EN':
    'http://gotaserver.xteink.com/api/download/ESP32C3/V3.1.0/V3.1.0-EN.bin',
  '3.0.8-CH':
    'http://47.122.74.33:5000/api/download/ESP32C3/V3.0.8/V3.0.8-CH.bin',
};

export async function getFirmware(version: keyof typeof urls) {
  const url = urls[version];

  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}
