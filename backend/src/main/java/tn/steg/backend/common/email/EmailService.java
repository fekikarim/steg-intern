package tn.steg.backend.common.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Lightweight email sender.
 *
 * <p>Designed for graceful degradation: sending failures are logged and never
 * propagate, so the primary business transaction (e.g. issuing a reset token)
 * does not fail because a mail backend is unavailable.</p>
 */
@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username:steg-noreply@localhost}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    @Async
    public void send(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent to {} subject={}", to, subject);
        } catch (Exception ex) {
            log.warn("Failed to send email to {} subject={}: {}", to, subject, ex.getMessage());
        }
    }
}
