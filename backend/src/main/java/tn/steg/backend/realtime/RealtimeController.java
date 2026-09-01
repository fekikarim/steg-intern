package tn.steg.backend.realtime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * REST controller that exposes the SSE endpoint for real-time
 * entity-change notifications.
 *
 * <p>Authenticated back-office clients connect to {@code GET /realtime/events}
 * and receive a stream of {@link RealtimeEvent} payloads whenever an entity
 * is created, updated, deleted, or has its status changed.</p>
 */
@Slf4j
@RestController
@RequestMapping("/realtime")
@RequiredArgsConstructor
public class RealtimeController {

    private final RealtimeService realtimeService;

    /**
     * Opens an SSE connection for real-time event streaming.
     * The connection stays open until the client disconnects or the
     * 30-minute timeout elapses.
     */
    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        log.info("SSE subscription request received");
        return realtimeService.createEmitter();
    }
}
