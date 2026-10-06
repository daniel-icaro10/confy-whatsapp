import { NextResponse } from "next/server";

export async function GET() {
    const js = `(function() {
    var script = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    var sessionId = script ? script.getAttribute('data-session') : null;
    if (!sessionId) {
        console.error('[Webchat] Atributo data-session ausente na tag <script>');
        return;
    }

    var baseUrl = script.src.split('/api/webchat')[0];

    // Create Container
    var container = document.createElement('div');
    container.id = 'zapply-webchat-root';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Create Button
    var btn = document.createElement('button');
    btn.id = 'zapply-webchat-button';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.borderRadius = '50%';
    btn.style.backgroundColor = '#2563eb';
    btn.style.color = '#ffffff';
    btn.style.border = 'none';
    btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';

    btn.onmouseenter = function() { btn.style.transform = 'scale(1.08)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; };

    // Create Iframe Container
    var frame = document.createElement('iframe');
    frame.id = 'zapply-webchat-frame';
    frame.src = baseUrl + '/webchat/' + sessionId;
    frame.style.display = 'none';
    frame.style.width = '380px';
    frame.style.height = '600px';
    frame.style.maxWidth = 'calc(100vw - 40px)';
    frame.style.maxHeight = 'calc(100vh - 100px)';
    frame.style.border = 'none';
    frame.style.borderRadius = '16px';
    frame.style.boxShadow = '0 12px 36px rgba(0,0,0,0.25)';
    frame.style.marginBottom = '14px';

    var isOpen = false;
    btn.onclick = function() {
        isOpen = !isOpen;
        if (isOpen) {
            frame.style.display = 'block';
            btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        } else {
            frame.style.display = 'none';
            btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
        }
    };

    container.appendChild(frame);
    container.appendChild(btn);
    document.body.appendChild(container);
})();`;

    return new NextResponse(js, {
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
        }
    });
}
