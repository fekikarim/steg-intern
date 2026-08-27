package tn.steg.backend.audit.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;
import tn.steg.backend.audit.AuditService;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.security.CurrentUserService;

import java.util.UUID;

/**
 * Aspect that records an audit entry for every method annotated with
 * {@link Audited}. Runs after the method completes successfully so only performed
 * actions are logged; exceptions propagate without being swallowed. The acting
 * user is resolved synchronously (in the request thread, where the security
 * context is available) and passed to the async audit service.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditService auditService;
    private final CurrentUserService currentUserService;
    private final ObjectMapper objectMapper;
    private final ExpressionParser parser = new SpelExpressionParser();

    @Around("@annotation(audited)")
    public Object audit(ProceedingJoinPoint joinPoint, Audited audited) throws Throwable {
        Object result = joinPoint.proceed();

        try {
            EvaluationContext context = new StandardEvaluationContext();
            Object[] args = joinPoint.getArgs();
            context.setVariable("args", args);
            context.setVariable("result", result);
            for (int i = 0; i < args.length; i++) {
                context.setVariable("arg" + i, args[i]);
            }

            UUID entityId = toUuid(eval(audited.entityId(), context));
            String newValue = toJson(eval(audited.newValue(), context));
            String oldValue = toJson(eval(audited.oldValue(), context));

            auditService.record(audited.action(), audited.entity(), entityId, oldValue, newValue, resolveActor());
        } catch (Exception ex) {
            // Audit capture must never break the business operation.
        }

        return result;
    }

    private String resolveActor() {
        try {
            if (!currentUserService.isAuthenticated()) {
                return null;
            }
            return currentUserService.currentEmail();
        } catch (Exception ex) {
            return null;
        }
    }

    private Object eval(String expression, EvaluationContext context) {
        if (expression == null || expression.isBlank()) {
            return null;
        }
        return parser.parseExpression(expression).getValue(context);
    }

    private UUID toUuid(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof UUID uuid) {
            return uuid;
        }
        String s = String.valueOf(value);
        return s.isBlank() ? null : UUID.fromString(s);
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String s) {
            return s;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            return String.valueOf(value);
        }
    }
}
