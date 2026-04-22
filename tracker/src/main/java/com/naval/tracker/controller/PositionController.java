package com.naval.tracker.controller;
import com.naval.tracker.model.PositionUpdate;

import com.naval.tracker.model.Navire;
import com.naval.tracker.service.NavireService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PositionController {

    private final NavireService navireService;

    public PositionController(NavireService navireService) {
        this.navireService = navireService;
    }

    @MessageMapping("/position")
    @SendTo("/topic/positions")
    public Navire mettreAJourPosition(PositionUpdate update) throws Exception {
        return navireService.mettreAJourPosition(update.getId(), update.getLatitude(), update.getLongitude());
    }
}