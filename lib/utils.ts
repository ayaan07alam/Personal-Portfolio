export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    });
}

export function formatDateRange(startDate: string, endDate: string | null, isCurrent: boolean): string {
    const start = formatDate(startDate);

    if (isCurrent) {
        return `${start} - Present`;
    }

    if (endDate) {
        return `${start} - ${formatDate(endDate)}`;
    }

    return start;
}
