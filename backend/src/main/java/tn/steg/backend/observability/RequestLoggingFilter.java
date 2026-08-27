package tn.steg.backend.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Logs every request with method, path, HTTP status, duration and a redacted
 * body. Sensitive fields (passwords, tokens) are masked before being written to
 * the log. The duration and a truncated response summary are emitted on finish.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final int BODY_LIMIT = 2000;
    private final SensitiveDataRedactor redactor;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.endsWith("/api-docs") || path.contains("/swagger-ui");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!(request instanceof ContentCachingRequestWrapper)) {
            request = new ContentCachingRequestWrapper(request);
        }
        if (!(response instanceof ContentCachingResponseWrapper)) {
            response = new ContentCachingResponseWrapper(response);
        }

        long start = System.nanoTime();
        String body = "";
        boolean error = false;
        try {
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            error = true;
            throw ex;
        } finally {
            long elapsedMs = (System.nanoTime() - start) / 1_000_000;
            byte[] bodyBytes = ((ContentCachingRequestWrapper) request).getContentAsByteArray();
            if (bodyBytes.length > 0) {
                body = truncate(new String(bodyBytes, StandardCharsets.UTF_8));
            }
            String redacted = redactor.redact(body);
            int status = response.getStatus();
            if (error) {
                log.error("req method={} uri={} status={} {}ms body={}",
                        request.getMethod(), request.getRequestURI(), status, elapsedMs, redacted);
            } else if (status >= 400) {
                log.warn("req method={} uri={} status={} {}ms body={}",
                        request.getMethod(), request.getRequestURI(), status, elapsedMs, redacted);
            } else {
                log.info("req method={} uri={} status={} {}ms body={}",
                        request.getMethod(), request.getRequestURI(), status, elapsedMs, redacted);
            }
            if (response instanceof ContentCachingResponseWrapper wrapper) {
                wrapper.copyBodyToResponse();
            }
        }
    }

    private String truncate(String value) {
        return value.length() > BODY_LIMIT ? value.substring(0, BODY_LIMIT) + "...[truncated]" : value;
    }
}
