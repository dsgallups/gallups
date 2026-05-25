#set page(
  paper: "us-letter",
  margin: (x: 0.7in, top: 0.5in, bottom: 0.5in),
)

#set text(font: "Helvetica Neue", size: 10.5pt)
#set par(leading: 0.55em, justify: false)

#show list: set list(indent: 0.6em, body-indent: 0.4em)

#let section(title) = {
  v(0.6em)
  text(weight: "bold", size: 12pt, title)
  v(-0.5em)
  line(length: 100%, stroke: 0.6pt)
  v(0.1em)
}

#let entry(name, location: none, date: none, role: none) = block(below: 0.4em)[
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    [*#name*#if location != none [ | #location]], if date != none { date } else { [] },
  )
  #if role != none {
    v(-0.8em)
    emph(role)
  }
]

#align(center)[
  #text(size: 20pt)[Daniel Studdard Gallups]

  +1 (765) 464-9247 | #link("https://gallups.com")[gallups.com] | #link("mailto:dsgallups@protonmail.com")[dsgallups\@protonmail.com]
]

#section[Experience]

#entry("Peacher.com", location: "Atlanta, GA", date: "March 2026 - Current")
- Political transparency platform designed to relay legislative data based on geographical location. Designed campaigning platform to target local issues and politicians
- Wrote multithreaded async web runtime

#entry(
  "Adversarial Risk Management",
  location: "Atlanta, GA",
  date: "May 2023 - March 2026",
  role: "Fullstack Software Engineer",
)
- Founding engineer, built all major components of a GRC Cybersecurity platform. Currently serving 5 enterprise clients
- Bespoke WASM-compatible *rendering engine* of abstract types to any drawing interface. Generates from a higher abstraction layer to PNG, SVG, PPTX and Docx. Signal-based reactivity
- Bespoke Svelte library of Stylistic Components + UX interactions.

#section[Projects]

#entry(
  "Open-source libraries",
  date: link("https://github.com/dsgallups")[github.com/dsgallups],
  role: "Owner/Maintainer",
)
- *MIDI parser*: Strongly-typed library used to read and write MIDI commands with Bevy extension
- *wasm-tracing*: Maintained fork of the general tracing-wasm crate
- General open source contributions (mainly to the bevy ecosystem)

*Finished Projects*
- Bevy Game Jam 6 -- Bow-and-arrow game, landed \#8
- The Rusty Repeater -- an Evil Proxy to beat JA3 and JA4
- Polynomial NEAT -- A GPU-based rendition of NEAT. ML architecture that utilizes multivariate polynomial expansion to predict output

*Other Projects*
- Bevy piano-based video game. Working midi editor, game level design still wip
- Patreon competitor platform (please ask! I probably can't open-source this one)
- Overengineered cat toy project that burned a hole through my desk

*CSEC work*
- Achieved 2#super[nd] place in Fall 2021 HackIN competition
- Active participant of b01lers
- DEFCON 2025 -- Won Bombe Malware competition

#section[Education]

#entry("Purdue University", location: "West Lafayette, IN.", date: "May 2023")
