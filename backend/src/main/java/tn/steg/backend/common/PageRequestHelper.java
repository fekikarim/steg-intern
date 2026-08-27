package tn.steg.backend.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import tn.steg.backend.exception.BusinessException;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Builds bounded, sort-safe {@link Pageable} instances.
 *
 * <p>Guards against unbounded pagination (DoS via huge page sizes) and sort
 * injection by only allowing properties explicitly declared on a sorted
 * entity. Unknown sort properties fail fast with a clear business message.
 * </p>
 */
public final class PageRequestHelper {

    public static final int MAX_PAGE_SIZE = 100;

    private PageRequestHelper() {
    }

    /**
     * @param pageable raw client pageable (may be null / unbounded)
     * @param allowedSortProperties entity properties permitted in {@code sort}
     */
    public static Pageable safe(Pageable pageable, List<String> allowedSortProperties) {
        Pageable effective = pageable != null ? pageable : PageRequest.of(0, 20);
        int safePage = Math.max(0, effective.getPageNumber());
        int safeSize = clampSize(effective.getPageSize());

        Sort sort = normalizeSort(effective.getSort(), allowedSortProperties);
        return PageRequest.of(safePage, safeSize, sort);
    }

    private static int clampSize(int requested) {
        if (requested <= 0) {
            return 20;
        }
        return Math.min(requested, MAX_PAGE_SIZE);
    }

    private static Sort normalizeSort(Sort sort, List<String> allowedProperties) {
        if (sort == null || sort.isUnsorted()) {
            return Sort.unsorted();
        }
        Set<String> allowed = new LinkedHashSet<>(allowedProperties);
        List<Sort.Order> safeOrders = new java.util.ArrayList<>();
        for (Sort.Order order : sort) {
            if (!allowed.contains(order.getProperty())) {
                throw new BusinessException("Unsupported sort property: " + order.getProperty());
            }
            safeOrders.add(order);
        }
        return Sort.by(safeOrders);
    }
}
