package tn.steg.backend.audit.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a method for automatic audit logging. The AOP aspect resolves the SpEL
 * expressions against the method's arguments ({@code #args[0]}, {@code #args[1]}
 * ...) and the return value ({@code #result}), then records an audit entry.
 *
 * <pre>
 * &#64;Audited(action = "CREATE", entity = "USER",
 *        entityId = "#result.id", newValue = "#result")
 * public UserResponse createUser(CreateUserRequest request) { ... }
 * </pre>
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audited {

    /** Action label, e.g. CREATE, UPDATE, DELETE, LOGIN, LOCK, UNLOCK. */
    String action();

    /** Logical entity name, e.g. USER, INTERNSHIP, ROLE. */
    String entity();

    /**
     * SpEL expression resolving to the affected entity id (may be blank).
     * References method args via {@code #args[i]} and return value via {@code #result}.
     */
    String entityId() default "";

    /**
     * SpEL expression resolving to a snapshot of the new/result state.
     * May be blank to skip.
     */
    String newValue() default "";

    /**
     * SpEL expression resolving to a snapshot of the previous state.
     * May be blank to skip.
     */
    String oldValue() default "";
}
