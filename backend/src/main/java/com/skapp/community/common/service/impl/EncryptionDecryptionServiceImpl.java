package com.skapp.community.common.service.impl;

import com.skapp.community.common.constant.CommonMessageConstant;
import com.skapp.community.common.exception.ModuleException;
import com.skapp.community.common.service.EncryptionDecryptionService;
import com.skapp.community.common.util.EncryptDecryptUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class EncryptionDecryptionServiceImpl implements EncryptionDecryptionService {

	@Value("${encryptDecryptAlgorithm.secret}")
	private String encryptSecret;

	@Override
	public String encrypt(String stringToEncrypt, String secretKey) {
		if (secretKey == null)
			secretKey = this.encryptSecret;
		if (stringToEncrypt == null)
			return null;
		try {
			byte[] initializationVector = new byte[12];
			SecureRandom secureRandom = new SecureRandom();
			secureRandom.nextBytes(initializationVector);

			Cipher cipher = EncryptDecryptUtil.initializeCipher(Cipher.ENCRYPT_MODE, secretKey, initializationVector);

			byte[] encryptedBytes = cipher.doFinal(stringToEncrypt.getBytes(StandardCharsets.UTF_8));

			byte[] encryptedIvAndText = ByteBuffer.allocate(initializationVector.length + encryptedBytes.length)
				.put(initializationVector)
				.put(encryptedBytes)
				.array();

			return Base64.getEncoder().encodeToString(encryptedIvAndText);
		}
		catch (Exception exception) {
			log.error("encrypt: String encryption: {}", exception.getMessage());
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_ENCRYPTION_FAILED);
		}
	}

	@Override
	public String decrypt(String stringToDecrypt, String secretKey) {
		if (secretKey == null)
			secretKey = this.encryptSecret;
		if (stringToDecrypt == null)
			return null;
		try {
			byte[] decodedMessage = Base64.getDecoder().decode(stringToDecrypt);

			ByteBuffer byteBuffer = ByteBuffer.wrap(decodedMessage);
			byte[] initializationVector = new byte[12];
			byteBuffer.get(initializationVector);
			byte[] encryptedBytes = new byte[byteBuffer.remaining()];
			byteBuffer.get(encryptedBytes);

			Cipher cipher = EncryptDecryptUtil.initializeCipher(Cipher.DECRYPT_MODE, secretKey, initializationVector);

			byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
			return new String(decryptedBytes, StandardCharsets.UTF_8);
		}
		catch (Exception exception) {
			log.error("decrypt: String decryption: {}", exception.getMessage());
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DECRYPTION_FAILED);
		}
	}

}
