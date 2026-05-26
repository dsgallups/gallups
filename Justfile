
[working-directory('website')]
dev:
    pnpm run dev --port 5180 --strictPort

resume:
    typst watch resume/resume.typ resume/"Daniel Gallups Resume.pdf"
