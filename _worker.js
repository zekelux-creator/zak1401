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

    // ✅ Domaine canonique : https + sans www
    // Corrige les 4 variantes détectées par Google Search Console
    // (http/https x www/non-www qui répondaient toutes en 200 séparément)
    const CANONICAL_HOST = "plafonnage-facade-luxembourg.be";
    let needsRedirect = false;

    if (url.protocol !== "https:") {
      url.protocol = "https:";
      needsRedirect = true;
    }
    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      needsRedirect = true;
    }

    // ✅ Cas particulier : /index.html -> racine "/"
    if (url.pathname === "/index.html") {
      url.pathname = "/";
      needsRedirect = true;
    } else if (url.pathname.endsWith(".html")) {
      // ✅ Redirection 301 : version .html -> version sans extension
      url.pathname = url.pathname.replace(/\.html$/, "");
      needsRedirect = true;
    }

    if (needsRedirect) {
      return Response.redirect(url.toString(), 301);
    }

    // ✅ Sert les assets statiques normalement
    return env.ASSETS.fetch(request);
  },
};
