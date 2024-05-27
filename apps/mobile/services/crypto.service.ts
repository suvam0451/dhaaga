class CryptoService {
  static stringArrayToBuffer(array: string[]) {
    // Calculate the total length of the ArrayBuffer
    let totalLength = array.reduce((acc, str) => acc + str.length, 0);

    // Create a new ArrayBuffer with the calculated length
    let buffer = new ArrayBuffer(totalLength);

    // Create a Uint8Array view of the buffer
    let uint8Array = new Uint8Array(buffer);

    // Fill the uint8Array with the string data converting each character to its char code
    let offset = 0;
    for (let str of array) {
      for (let i = 0; i < str.length; i++) {
        uint8Array[offset++] = str.charCodeAt(i);
      }
    }

    return buffer;
  }

  static arrayBufferToString(input: ArrayBuffer) {
    let decoder = new TextDecoder('utf-8'); // Assuming the buffer is encoded as 'utf-8'
    return decoder.decode(input)
  }

  static encodeStringArray(input: string[]) {
    const hash = this.stringArrayToBuffer(input)
    return this.arrayBufferToString(hash)
  }
}

export default CryptoService