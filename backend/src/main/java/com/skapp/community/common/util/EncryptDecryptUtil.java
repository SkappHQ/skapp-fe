package com.skapp.community.common.util;

import com.skapp.community.common.constant.CommonMessageConstant;
import com.skapp.community.common.constant.EncryptionDecryptionAlgorithmConstants;
import com.skapp.community.common.exception.ModuleException;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;

@Slf4j
@UtilityClass
public class EncryptDecryptUtil {

	public static SecretKey generateSecureKey(String secretKey) {
		try {
			byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
			MessageDigest shaValue = MessageDigest.getInstance(EncryptionDecryptionAlgorithmConstants.SHA_VERSION);
			keyBytes = shaValue.digest(keyBytes);
			return new SecretKeySpec(keyBytes, EncryptionDecryptionAlgorithmConstants.ALGORITHM);
		}
		catch (Exception exception) {
			log.error("generateSecureKey: Secure key generation: {}", exception.getMessage());
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_ENCRYPTION_DECRYPTION_SET_KEY_FAILED);
		}
	}

	public static Cipher initializeCipher(int cipherMode, String secretKey, byte[] initializationVector)
			throws GeneralSecurityException {
		Cipher cipher = Cipher.getInstance(EncryptionDecryptionAlgorithmConstants.TRANSFORMATION);
		GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(128, initializationVector);
		cipher.init(cipherMode, EncryptDecryptUtil.generateSecureKey(secretKey), gcmParameterSpec);
		return cipher;
	}

}
