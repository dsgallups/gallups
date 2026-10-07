#set page(
  paper: "us-letter",
  margin: (x: 0.7in, top: 0.4in, bottom: 0.35in),
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
  "Tennr",
  location: "New York, NY",
  date: "August 2026 - Present",
  role: "Software Engineer, Core Platform",
)
- Primary engineer for *Patient Hub*, the center of Tennr's customer-facing healthcare platform, owning its maintenance, upgrades, and new features in *TypeScript*
- Shipped bug fixes and features, including urgent-patient flagging so a patient's workflows skip the line
- Went onsite with a customer to diagnose friction in their workflows, then implemented the fixes
- Led the cross-team discussion on deriving order checklists via reachability analysis over cyclic workflow graphs, determining when an order's possible stages are exhaustive, possibly unknown, or unknowable

#entry(
  "Adversarial Risk Management",
  date: "May 2022 - March 2026",
  role: "Founding Engineer",
)
- First engineering hire: built the GRC platform from an empty repo (architecture, CI/CD, *Rust* backend, *Svelte/TypeScript* frontend) and ran solo for the first five months, laying the foundation the team grew around
- Scaled the team *1 #sym.arrow.r 10* (5 engineers + 4 interns) and revenue from *\$0 to an estimated \$500K ARR* over three years (\$120K #sym.arrow.r \$200K #sym.arrow.r \$500K), landing *5 enterprise clients* across heavy industry within 18 months
- Ran day-to-day engineering: set technical direction, coordinated deliverables across backend/frontend/UX, and kept a lightweight process with standups only when they earned their keep
- Mentored a mostly early-career team to own their domains end-to-end; personally onboarded interns, *3 of whom converted to full-time engineers* (2 from Georgia Tech)
- Architected a *WebAssembly* rendering engine (PNG/SVG/PPTX/DOCX from a single high-level abstraction, signal-based reactivity) and authored the platform's bespoke Svelte component + UX library

#entry("Peacher.app", date: "March 2026 - Present", role: "Side Project")
- Solo-built a civic-engagement platform that surfaces legislative activity by location; live with search, real-time updates, accounts, and posting, now adding local-campaigning tools (signable petitions)
- Engineered a custom multithreaded async web runtime in *Rust* (Bevy + WebAssembly) that offloads concurrent work like WebTransport across N worker threads, keeping the main UI thread non-blocking

#section[Open Source]

#entry(
  "Published Rust crates",
  date: link("https://crates.io/users/dsgallups")[crates.io/dsgallups],
  role: "120K+ all-time downloads",
)
- *wasm-tracing*: maintainer of the standard structured-tracing crate for Rust in the browser (*90K+ downloads*)
- *midix*: strongly typed MIDI parsing with Bevy integration and a synth (*24K+ downloads* across the family)
- *trotcast* (lock-free MPMC channel) and *cargo-color-gen* (Bevy UI color CLI), *4K+ downloads* each
- Ongoing contributions across the Bevy ecosystem

#section[Projects]

- *Polynomial NEAT*: GPU-accelerated neuro-evolution via multivariate polynomial expansion
- *Bevy Game Jam 6*: shipped a complete bow-and-arrow game under jam time limits; placed *\#8 of 77*

#section[Education & Honors]

#entry("Purdue University", location: "West Lafayette, IN", date: "May 2023", role: "B.S. in Cybersecurity")
#v(0.5em)
#entry("Bombe Malware Competition", location: "DEFCON", date: "2025", role: "1st place")
