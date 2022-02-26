package com.capstone.api.util

import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonConfig {
    @Bean
    JtsModule jtsModule() {
        return new JtsModule()
    }
}
