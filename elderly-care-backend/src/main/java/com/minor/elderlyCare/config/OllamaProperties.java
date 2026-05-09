package com.minor.elderlyCare.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.ollama")
public class OllamaProperties {

    private String baseUrl = "http://localhost:11434";
    private String model = "deepseek-r1:1.5b";
    private Duration connectTimeout = Duration.ofSeconds(3);
    private Duration readTimeout = Duration.ofSeconds(25);
}
