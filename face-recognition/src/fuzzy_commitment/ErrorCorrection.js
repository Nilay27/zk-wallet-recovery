import * as rs from './ReedSolomons';
import * as helper from './Helpers';
class ReedSolomonEC {
  // Define all Constants
  static MESSAGE_LENGTH = 128;
  static ERROR_CORRECTION_LENGTH = 12;
  static SECRET_LENGTH = 64;

  constructor() {
    this.ec = this.initializeRS(ReedSolomonEC.MESSAGE_LENGTH, ReedSolomonEC.ERROR_CORRECTION_LENGTH);
  }

  initializeRS(messageLength, errorCorrectionLength) {
    var dataLength = messageLength - errorCorrectionLength;
    var encoder = new rs.ReedSolomonEncoder(rs.GenericGF.AZTEC_DATA_8());
    var decoder = new rs.ReedSolomonDecoder(rs.GenericGF.AZTEC_DATA_8());
    return {
      dataLength: dataLength,
      messageLength: messageLength,
      errorCorrectionLength: errorCorrectionLength,

      encode: function (message) {
        encoder.encode(message, errorCorrectionLength);
      },

      decode: function (message) {
        decoder.decode(message, errorCorrectionLength);
      },
    };
  }

  async fuzzyCommitment(feat_vec) {
    feat_vec = feat_vec.map((value) => helper.binaryQuantize(value));
    console.log(`Quantized Descriptor for face:`, feat_vec);
    var s = helper.generateRandomSecret(ReedSolomonEC.SECRET_LENGTH);
    console.log('Secret', s);
    var packet = new Uint8Array(this.ec.messageLength);
    s.forEach((byte, i) => (packet[i] = byte));

    this.ec.encode(packet);
    console.log('Packet after encoding', packet);
    var paddedFeatVec = helper.padArray(feat_vec, packet.length, 0);
    var c = helper.xor(paddedFeatVec, packet);
    var commitment = new Uint8Array(c);
    console.log('Commitment', commitment);
    var h_w = await helper.poseidon128Hash(packet);
    // var h_w = new Uint8Array(hashBuffer);
    console.log('commitment Hash', h_w);
    var feature_vec_hash = await helper.poseidon128Hash(feat_vec);
    return { commitment: commitment, featureVectorHash: feature_vec_hash };
  }

  async recover(feat_vec_prime, c) {
    feat_vec_prime = feat_vec_prime.map((value) => helper.binaryQuantize(value));
    console.log(`Quantized Descriptor for face:`, feat_vec_prime);
    var packet_prime = helper.xor(feat_vec_prime, c);
    console.log('Attempting to recover packet', packet_prime);
    var err_packet = new Uint8Array(packet_prime);
    console.log('Packet before decoding', err_packet);
    try {
      this.ec.decode(packet_prime);
    } catch (error) {
      console.error('Error correction failed:', error);
      return null;
    }
    const original_packet = new Uint8Array(packet_prime);
    const err_vector = helper.xor(err_packet, original_packet);
    const numError = err_vector.reduce((acc, curr) => (curr !== 0 ? acc + 1 : acc), 0);
    console.log('Error vector', err_vector);
    console.log('Number of errors', numError);
    console.log('Recovered packet', original_packet);
    var h_w_prime = await helper.poseidon128Hash(original_packet);
    // var h_w_prime = new Uint8Array(hashBuffer);
    console.log('Recovered commitment hash', h_w_prime);
    console.log('original feature vector', helper.xor(feat_vec_prime, err_vector));
    var original_feat_vec = helper.xor(feat_vec_prime, err_vector);
    var feature_vec_hash = await helper.poseidon128Hash(new Uint8Array(original_feat_vec));
    console.log('original feature vector hash', feature_vec_hash);
    var hash_commitment = await helper.poseidon128Hash(c);
    return {
      err_vector: err_vector,
      feat_vec_prime: feat_vec_prime,
      feature_vec_hash: feature_vec_hash,
    };
  }
}

export default ReedSolomonEC;
