export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ Robots.txt personnalisé
    if (url.pathname === "/robots.txt") {
      const robotsContent = `# --- ACCÈS TOTAL POUR LES IA ET MOTEURS ---

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=yes
Allow: /

# --- SÉCURITÉ ---
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/plugins/
Disallow: /readme.html

Sitemap: https://plafonnage-facade-luxembourg.be/sitemap.xml`;

      return new Response(robotsContent, {
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // ✅ Redirection 301 : version .html -> version sans extension
    // Corrige le contenu dupliqué détecté par Google Search Console
    // (ex: /isolation-interieur.html et /isolation-interieur répondaient
    // tous les deux en 200 avec le même contenu, sans redirection entre eux)
    if (url.pathname.endsWith(".html") && url.pathname !== "/index.html") {
      url.pathname = url.pathname.replace(/\.html$/, "");
      return Response.redirect(url.toString(), 301);
    }

    // ✅ Sert les assets statiques normalement
    return env.ASSETS.fetch(request);
  },
};
