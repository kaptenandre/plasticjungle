// Edit this file to update the site. No build step needed.
window.PJ = {
  releases: [
    {
      cat: "PJ001",
      artist: "Miike Snow",
      title: "Albumtitel",
      year: 2026,
      cover: "", // e.g. "assets/covers/pj001.jpg"
      links: [
        { label: "Spotify", url: "" },
        { label: "Apple Music", url: "" },
        { label: "Tidal", url: "" },
        { label: "Bandcamp", url: "" },
        { label: "Buy vinyl", url: "" },
      ],
    },
  ],

  socials: [
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "Spotify", url: "https://open.spotify.com/" },
    { label: "YouTube", url: "https://www.youtube.com/" },
    { label: "TikTok", url: "https://www.tiktok.com/" },
  ],

  contact: {
    email: "info@plasticjungle.world",
    phone: "", // e.g. "+46 70 000 00 00"
  },

  // Mailchimp: Audience > Signup forms > Embedded forms. Copy the form "action" URL
  // (https://XXXX.usN.list-manage.com/subscribe/post?u=...&id=...) and the
  // honeypot input name (b_<u>_<id>). Add a PHONE merge field to the audience.
  mailchimp: {
    action: "",
    honeypot: "",
  },
};
