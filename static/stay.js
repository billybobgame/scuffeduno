function disableExternalLinks(doc) {
    doc.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;

        // Check if link is external
        try {
            const url = new URL(link.href, doc.baseURI);
            if (url.origin !== window.location.origin) {
                e.preventDefault(); // stop navigation
                e.stopPropagation();
                console.log('Blocked external link:', link.href);
            }
        } catch {
            // ignore invalid URLs
        }
    });
}

// Apply to main document
disableExternalLinks(document);

// Apply to same-origin iframes
document.querySelectorAll('iframe').forEach(iframe => {
    try {
        if (iframe.contentDocument) {
            disableExternalLinks(iframe.contentDocument);
        }
    } catch(e) {
        console.warn('Cannot access iframe:', e);
    }
});
