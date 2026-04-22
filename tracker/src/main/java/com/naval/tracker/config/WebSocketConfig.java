package com.naval.tracker.config;

import com.naval.tracker.handler.NavireWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NavireWebSocketHandler navireWebSocketHandler;

    public WebSocketConfig(NavireWebSocketHandler navireWebSocketHandler) {
        this.navireWebSocketHandler = navireWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
            registry.addHandler(navireWebSocketHandler, "/ws")
                .setAllowedOriginPatterns("*");
    }
}