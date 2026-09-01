package tn.steg.backend.realtime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Manages Server-Sent Events connections and broadcasts real-time
 * entity-change notifications to all connected back-office clients.
 *
 * <p>Each connected client gets a unique {@link SseEmitter} with a long
 * timeout (30 minutes). The emitter is removed automatically on completion,
 * timeout, or error. Broadcasts are sent to all connected emitters
 * simultaneously — a single failed emitter is skipped without affecting
 * others.</p>
 */
@Slf4j
@Service
public class RealtimeService {

    private static final long SSE_TIMEOUT = 30 * 60 * 1000L; // 30 minutes

    /** All currently connected SSE emitters, keyed by a unique ID. */
    private final Set<SseEmitter> emitters = new CopyOnWriteArraySet<>();

    /**
     * Registers a new SSE emitter and returns it to the controller.
     * The emitter is configured with a long timeout and completion/error
     * callbacks that auto-remove it from the active set.
     */
    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            log.debug("SSE client disconnected (completion). Active: {}", emitters.size());
        });

        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            log.debug("SSE client disconnected (timeout). Active: {}", emitters.size());
        });

        emitter.onError(e -> {
            emitters.remove(emitter);
            log.debug("SSE client disconnected (error: {}). Active: {}", e.getMessage(), emitters.size());
        });

        emitters.add(emitter);
        log.info("SSE client connected. Active: {}", emitters.size());
        return emitter;
    }

    /**
     * Broadcasts an event to all connected SSE clients.
     * Failed emitters are skipped and removed.
     *
     * @param event the event to broadcast
     */
    public void broadcast(RealtimeEvent event) {
        if (emitters.isEmpty()) {
            return;
        }

        String eventId = UUID.randomUUID().toString();
        Set<SseEmitter> dead = new CopyOnWriteArraySet<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .id(eventId)
                        .name(event.getEntity() + ":" + event.getAction())
                        .data(event));
            } catch (IOException e) {
                dead.add(emitter);
                log.debug("Failed to send SSE event to client: {}", e.getMessage());
            }
        }

        // Remove dead emitters
        emitters.removeAll(dead);
        if (!dead.isEmpty()) {
            log.debug("Removed {} dead SSE emitters. Active: {}", dead.size(), emitters.size());
        }
    }

    /**
     * Returns the number of currently connected SSE clients.
     */
    public int getActiveClientCount() {
        return emitters.size();
    }
}
