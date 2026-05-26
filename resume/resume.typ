#set page(
  paper: "us-letter",
  margin: (x: 0.7in, top: 0.45in, bottom: 0.45in),
)

#set text(font: "Helvetica Neue", size: 10pt)
#set par(leading: 0.45em, justify: false)

#show list: set list(indent: 0.6em, body-indent: 0.4em, spacing: 0.6em)

#let section(title) = {
  text(weight: "bold", size: 12pt, title)
  v(-0.75em)
  line(length: 100%, stroke: 0.6pt)
  v(-0.5em)
}

#let entry(name, location: none, date: none, role: none) = block(below: 0.3em)[
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    [*#name*#if location != none [ | #location]], if date != none { date } else { [] },
  )
  #if role != none {
    v(-0.7em)
    emph(role)
    v(0.4em)
  }
]

#align(center)[
  #text(size: 19pt, weight: "bold")[Daniel Studdard Gallups]
  #v(-1em)
  +1 (765) 464-9247 | #link("https://gallups.com")[gallups.com] | #link("mailto:dsgallups@protonmail.com")[dsgallups\@protonmail.com]
  #v(-1em)
]

#section[Skills]

*Languages & Data:* Rust, TypeScript, SQL \
#v(-0.5em)
*Engineering:* Svelte, WebAssembly, WebTransport, async runtimes, multithreaded concurrency, systems programming, GPU compute, CI/CD \
#v(-0.5em)
*Leadership:* team building, mentorship, hiring, technical roadmapping, lightweight agile process

#section[Experience]

#entry(
  "Adversarial Risk Management",
  location: "Atlanta, GA",
  date: "May 2022 - March 2026",
  role: "Founding Engineer",
)
- First engineering hire: built the GRC platform from an empty repo (architecture, CI/CD, *Rust* backend, *Svelte/TypeScript* frontend) and ran solo for the first five months, laying the foundation the team grew around
- Scaled the team *1 #sym.arrow.r 10* (5 engineers + 4 interns) and revenue from *\$0 to an estimated \$500K ARR* over three years (\$120K #sym.arrow.r \$200K #sym.arrow.r \$500K), landing *5 enterprise clients* across heavy industry within 18 months
- Ran day-to-day engineering: set technical direction, coordinated deliverables across backend/frontend/UX, and kept a lightweight process: standups only when they earned their keep
- Mentored a mostly early-career team to own their domains end-to-end; personally onboarded interns, *3 of whom converted to full-time engineers* (2 from Georgia Tech)
- Architected a *WebAssembly* rendering engine (PNG/SVG/PPTX/DOCX from a single high-level abstraction, signal-based reactivity) and authored the platform's bespoke Svelte component + UX library

#entry("Peacher.com", location: "Atlanta, GA", date: "March 2026 - Present", role: "Founder")
- Founded and independently built a civic-engagement platform that surfaces legislative activity by geographic location, taking it from zero to public launch as the sole engineer
- Engineered a custom multithreaded async web runtime in *Rust* (Bevy + WebAssembly) that offloads concurrent work like WebTransport across N worker threads, keeping the main UI thread non-blocking
- Shipped and live: location-based legislative search, real-time legislative updates, user accounts, and posting; currently building local-campaigning tools (signable, action-oriented petitions)

#section[Open Source]

#entry(
  "Published Rust crates",
  date: link("https://crates.io/users/dsgallups")[crates.io/dsgallups],
  role: "120K+ all-time downloads",
)
- *wasm-tracing*: maintainer of the standard structured-tracing crate for Rust in the browser (*90K+ downloads*)
- *midix*: strongly-typed MIDI parsing with a Bevy integration and synthesizer (*24K+ combined downloads* across the family)
- *trotcast* (lock-free MPMC broadcast channel) and *cargo-color-gen* (CLI for Bevy UI color schemes), *4K+ downloads* each
- Ongoing contributions across the Bevy ecosystem

#section[Projects]

- *Polynomial NEAT*: GPU-accelerated neuro-evolution architecture using multivariate polynomial expansion to predict outputs
- *The Rusty Repeater*: networking proxy that defeats JA3/JA4 TLS fingerprinting
- *Bevy Game Jam 6*: shipped a complete bow-and-arrow game under jam time limits; placed *\#8 of 77*

#section[Education & Honors]

#entry("Purdue University", location: "West Lafayette, IN.", date: "May 2023", role: "B.S. in Cybersecurity")
#v(0.5em)
#entry("Bombe Malware Competition", location: "DEFCON", date: "2025", role: "1st place")
