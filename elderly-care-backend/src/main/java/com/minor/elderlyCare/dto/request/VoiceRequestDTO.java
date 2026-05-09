package com.minor.elderlyCare.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceRequestDTO {

    @Size(max = 2000, message = "Text must be at most 2000 characters")
    private String text;

    private UUID elderId;
}
