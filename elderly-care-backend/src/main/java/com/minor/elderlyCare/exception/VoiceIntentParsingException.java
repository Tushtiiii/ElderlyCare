package com.minor.elderlyCare.exception;

public class VoiceIntentParsingException extends RuntimeException {

    public VoiceIntentParsingException(String message, Throwable cause) {
        super(message, cause);
    }

    public VoiceIntentParsingException(String message) {
        super(message);
    }
}
