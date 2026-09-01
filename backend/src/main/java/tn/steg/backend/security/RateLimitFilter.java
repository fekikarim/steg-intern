package tn.steg.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import tn.steg.backend.common.ApiError;
import tn.steg.backend.common.ApiErrorCode;
import tn.steg.backend.config.RateLimitProperties;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory sliding-window rate limiter.
 *
 * <p>Limits each client (by IP) to a per-minute budget as configured in
 * {@link RateLimitProperties}. Stricter budgets are applied to the
 * authentication endpoints and to sensitive write operations. This is a
 * lightweight, dependency-free guard suitable for a single-node deployment;
 * a distributed limiter (e.g. Redis) should replace it under multi-node
 * scaling.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MILLIS = 60_000L;

    private final RateLimitProperties properties;
    private final ObjectMapper objectMapper;

    /**
     * Separate deques per client-key + budget-category so that GET traffic
     * does not consume the budget for write operations.
     * Key format: {@code <client-ip>:<category>} where category is
     * {@code auth}, {@code sensitive}, or {@code default}.
     */
    private final Map<String, ArrayDeque<Long>> requests = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!properties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = clientKey(request);
        String category = categoryFor(request);
        int budget = budgetFor(request);

        if (!tryAcquire(clientIp, category, budget)) {
            reject(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String clientKey(HttpServletRequest request) {
        // Behind a reverse proxy this header must be set by the trusted proxy.
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            String first = forwardedFor.split(",")[0].trim();
            if (StringUtils.hasText(first)) {
                return first;
            }
        }
        return request.getRemoteAddr();
    }

    /**
     * Returns the budget category for the request: {@code auth}, {@code sensitive},
     * or {@code default}. Each category maintains its own sliding window.
     */
    private String categoryFor(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.startsWith("/auth/")) {
            return "auth";
        }
        if (isWrite(request) && !path.startsWith("/actuator/")) {
            return "sensitive";
        }
        return "default";
    }

    private int budgetFor(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.startsWith("/auth/")) {
            return properties.getAuthPerMinute();
        }
        boolean sensitive = isWrite(request)
                && !path.startsWith("/actuator/")
                && !path.startsWith("/auth/");
        return sensitive ? properties.getSensitivePerMinute() : properties.getDefaultPerMinute();
    }

    private boolean isWrite(HttpServletRequest request) {
        String method = request.getMethod();
        return HttpMethod.POST.matches(method)
                || HttpMethod.PUT.matches(method)
                || HttpMethod.PATCH.matches(method)
                || HttpMethod.DELETE.matches(method);
    }

    private boolean tryAcquire(String clientIp, String category, int budget) {
        long now = System.currentTimeMillis();
        String key = clientIp + ":" + category;
        ArrayDeque<Long> window = requests.computeIfAbsent(key, k -> new ArrayDeque<>());

        synchronized (window) {
            // Drop timestamps outside the sliding window.
            while (!window.isEmpty() && now - window.peekFirst() > WINDOW_MILLIS) {
                window.pollFirst();
            }
            if (window.size() >= budget) {
                return false;
            }
            window.addLast(now);
            return true;
        }
    }

    private void reject(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ApiError error = ApiError.builder()
                .timestamp(Instant.now())
                .code(ApiErrorCode.RATE_LIMIT_EXCEEDED.value())
                .status(ApiErrorCode.RATE_LIMIT_EXCEEDED.getStatus())
                .message("Too many requests. Please retry later.")
                .path(request.getRequestURI())
                .build();

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", "60");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), error);

        log.warn("Rate limit exceeded for client {} on {}", clientKey(request), request.getRequestURI());
    }
}
