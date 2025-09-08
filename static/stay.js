function disableExternalLinks(doc) {
    doc.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;

        try {
            const url = new URL(link.href, doc.baseURI);
            if (url.origin !== window.location.origin) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Blocked external link:', link.href);
            }
        } catch {}
    });
}

function injectIntoIframe(iframe) {
    try {
        if (iframe.contentDocument) {
            disableExternalLinks(iframe.contentDocument);
        }
    } catch (e) {
        console.warn('Cannot access iframe:', e);
    }
}

// Apply to main document
disableExternalLinks(document);

// Apply to existing same-origin iframes
document.querySelectorAll('iframe').forEach(injectIntoIframe);

// Watch for iframes added or their src changed
const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'src') {
            injectIntoIframe(m.target);
        } else if (m.type === 'childList') {
            m.addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    injectIntoIframe(node);
                    // Observe src changes for this new iframe
                    iframeObserver.observe(node, { attributes: true });
                }
            });
        }
    });
});

// Observe the whole document for new iframes
observer.observe(document.body, { childList: true, subtree: true });

// Separate observer for src changes on iframes
const iframeObserver = new MutationObserver(mutations => {
    mutations.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'src') {
            injectIntoIframe(m.target);
        }
    });
});

// Attach src observer to existing iframes
document.querySelectorAll('iframe').forEach(iframe => {
    iframeObserver.observe(iframe, { attributes: true });
});
