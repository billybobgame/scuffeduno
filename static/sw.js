function fixLinks(doc) {
    doc.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (link.target === "_blank") {
                link.dataset.originalTarget = link.target; // store original
                link.target = "_self";
            }
        });
        link.addEventListener('mouseleave', () => {
            if (link.dataset.originalTarget) {
                link.target = link.dataset.originalTarget; // restore
                delete link.dataset.originalTarget;
            }
        });
    });
}

// Fix links on main document
fixLinks(document);

// Fix links inside same-origin iframes
document.querySelectorAll('iframe').forEach(iframe => {
    try {
        if (iframe.contentDocument) {
            fixLinks(iframe.contentDocument);
        }
    } catch(e) {
        // ignore cross-origin iframes
        console.warn('Cannot access iframe:', e);
    }
});
