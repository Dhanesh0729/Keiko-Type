# AI, Agentic & Conversational UX

AI-powered and conversational interfaces are now a mainstream surface, and they have their own hard-won
patterns distinct from classic forms and dashboards. The core design challenge is different: outputs are
**probabilistic, sometimes wrong, and often slow to generate**, so the UI's job is to build appropriate
trust — help users judge when to rely on the system, stay in control, and recover gracefully when it's
wrong. Read this whenever you design a chat, assistant, copilot, generation, or agent interface.

## Contents
- [Design for uncertainty](#design-for-uncertainty)
- [Streaming & latency feedback](#streaming--latency-feedback)
- [Keep the user in control](#keep-the-user-in-control)
- [Confirmation for consequential actions](#confirmation-for-consequential-actions)
- [Error & hallucination recovery](#error--hallucination-recovery)
- [Guiding input](#guiding-input)
- [Conversation & agent layout](#conversation--agent-layout)

## Design for uncertainty

The output may be wrong; the interface should never present it as infallible.

- **Show confidence and provenance where it matters.** Cite sources, link to the underlying data, and
  surface which documents/tools an answer drew on so users can verify. For consequential answers, "here's
  where this came from" matters more than a confident tone.
- **Signal the machine, don't fake humanity.** Be honest that it's AI; don't imply certainty or feelings
  it doesn't have. Avoid over-anthropomorphizing.
- **Make verification easy.** For factual or high-stakes output, design an obvious path to check it
  (expandable sources, "show reasoning," a diff against the original). The easier it is to verify, the
  more appropriately users trust it.

## Streaming & latency feedback

Generation is often slow (seconds), so *perceived* responsiveness is critical.

- **Stream tokens as they generate** rather than waiting for the whole response — it dramatically improves
  perceived speed and lets users start reading and bail early. Show a thinking/typing indicator before the
  first token.
- **Show intermediate progress for agents.** When the system is doing multi-step work (searching, calling
  tools, running steps), reveal what it's doing ("Searching docs… Reading 3 files… Drafting") so the wait
  is legible, not a frozen spinner.
- **Always allow Stop.** A generating or working response must be interruptible — a visible stop control
  that halts immediately.

## Keep the user in control

- **Stop, regenerate, and edit** are table-stakes controls: stop a response mid-stream, regenerate a
  different answer, and edit the previous prompt to branch. Let users copy output easily.
- **Steerability**: make it easy to redirect ("make it shorter," "more formal") without starting over —
  follow-ups, quick tone/length controls, or editable output.
- **Preserve user work.** Don't lose the user's prompt or context on error; keep the input recoverable.

## Confirmation for consequential actions

Agentic UIs act in the world (send email, delete data, spend money, change files). Autonomy must be
matched with checkpoints:

- **Human-in-the-loop for anything consequential or irreversible.** Preview the action and require explicit
  confirmation before it executes — show exactly what will happen ("Send this email to 12 recipients?",
  "Delete these 4 files?"), not a generic "Proceed?".
- **Scale friction to stakes.** Reversible, low-risk actions can run autonomously with an undo; irreversible
  or high-impact ones need explicit approval. Don't confirm everything (users stop reading) or nothing.
- **Make agent actions auditable** — a visible log of what the agent did, so users can review and undo.

## Error & hallucination recovery

- **Design for the wrong answer**, because it will happen. Make it cheap to correct: easy regenerate,
  feedback controls (thumbs up/down, "this is wrong"), and a graceful fallback ("I'm not sure — here's what
  I found" beats a confident fabrication).
- **Handle no-answer and refusal gracefully.** When the system can't or shouldn't answer, say so clearly
  and offer a next step, rather than a dead end or a made-up response.
- **Partial results**: if some steps succeed and some fail, show what worked and what didn't — don't
  discard the whole thing.

## Guiding input

An empty prompt box is intimidating and gives no sense of capability.

- **Suggestion chips / example prompts** on the empty state show what the system can do and lower the
  cost of starting.
- **Prompt affordances**: make it clear how to reference context (attach a file, @-mention, select text),
  and hint at useful commands.
- Set expectations about scope and limits up front so users aren't surprised by what it can't do.

## Conversation & agent layout

- **Legible turn-taking**: clearly distinguish user turns from system turns; keep the input anchored and
  in reach; auto-scroll to the latest but let users scroll back without fighting it.
- **Render rich output well.** Responses often contain markdown, code (with copy buttons and syntax
  highlighting), tables, and citations — design these, don't dump plaintext. Long responses need structure
  (headings, lists) to be scannable.
- **Don't force chat where a UI is better.** Conversation is great for open-ended, ambiguous tasks; for
  structured, repeatable ones, buttons/forms/direct manipulation are faster and less error-prone. The best
  AI products blend conversational and graphical UI rather than making everything a chat.
