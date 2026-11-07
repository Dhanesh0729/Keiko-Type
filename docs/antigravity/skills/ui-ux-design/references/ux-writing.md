# UX Writing & Microcopy

Interface text is designed material, not filler. The fastest way to make otherwise-crafted UI read cheap
is placeholder-grade wording — "Submit," "Something went wrong," "No data." Good microcopy is often the
difference between a screen users understand instantly and one they have to puzzle over. Design the words
with the same care as the layout.

## Contents
- [Voice & tone](#voice--tone)
- [Buttons, labels & actions](#buttons-labels--actions)
- [Empty, error & system states](#empty-error--system-states)
- [Notifications & confirmations](#notifications--confirmations)
- [Formatting: numbers, dates, names](#formatting-numbers-dates-names)
- [Principles that always apply](#principles-that-always-apply)

## Voice & tone

- **Voice is constant; tone flexes.** Voice is the product's personality (plain and reassuring, or witty
  and bold) — consistent everywhere. Tone adapts to the moment: warmer in an error, calmer in a
  confirmation, out of the way in a routine label. Derive both from the audience and the product's point
  of view (a tax app and a party-planning app should not sound alike).
- **Write like a helpful person, not a system.** Address the user as "you"; refer to the product as "we"
  sparingly. Avoid jargon and internal terminology. Say "We couldn't save your changes," not "Error 500:
  persistence failure."
- **Don't force personality into high-stress moments.** Jokes in an error about lost work or a failed
  payment land badly. Be clear and human first; be clever only where the stakes are low.

## Buttons, labels & actions

- **Buttons name the action, specifically.** "Create project," "Send invite," "Delete 3 files" — the user
  should predict exactly what happens from the label alone. Avoid vague "Submit," "OK," "Yes/No" on
  consequential actions; label both buttons with their outcome ("Discard changes" / "Keep editing").
- **Lead with the verb.** "Add payment method," not "Payment method." Titles and section headers can be
  nouns; actions are verbs.
- **Match label to consequence.** Destructive actions get plain, honest labels ("Delete account
  permanently"), not euphemisms. The confirming button in a delete dialog should say the verb ("Delete"),
  not "OK."
- **Sentence case is the modern default** for buttons, labels, menus, and headings ("Create new project,"
  not "Create New Project"). It's friendlier and easier to read; reserve Title Case for proper nouns and
  brand names. Be consistent across the whole product either way.

## Empty, error & system states

These are where copy does the most work (and is most often neglected). See also `design-foundations.md`
§ states for the visual side.

- **Empty states** teach and invite. Say what belongs here and give the action to start: "No projects yet
  — create your first to get going" with a **Create project** button. A bare "No data" is a dead end.
  Distinguish *first-run* empty (onboarding opportunity) from *no-results* empty (offer to clear filters
  or broaden the search).
- **Error messages** follow a simple shape: **what happened → why (if useful) → how to fix it**, in plain
  language, without blame. "That email is already registered — try signing in instead" beats "Invalid
  input." Never expose raw codes or stack traces to end users; never blame the user ("You entered it
  wrong"). Offer the recovery action inline (Retry, Sign in, Contact support).
- **Loading / progress copy** sets expectations for anything slow: "Uploading… this can take a minute for
  large files." For long jobs, say what's happening and roughly how long.
- **Success/confirmation** copy is brief and specific: "Invite sent to maria@acme.com," not just "Done."

## Notifications & confirmations

- **Notifications** are relevant, timely, and self-contained — the user should grasp what happened and
  what to do without opening the app. Front-load the important part; respect that these interrupt.
- **Confirmation dialogs** state the consequence and make the buttons unambiguous. Title = the question or
  action ("Delete this workspace?"), body = what will actually happen ("This removes all 42 projects and
  can't be undone"), buttons = the two outcomes named as verbs. Reserve confirmations for consequential or
  irreversible actions — confirming everything trains users to click through blindly. Prefer undo over a
  confirmation where possible (let the action happen, offer "Undo" for a few seconds).

## Formatting: numbers, dates, names

- **Format for humans and locale.** Dates, times, numbers, and currency follow the user's locale
  conventions, not a hard-coded US format (see `internationalization.md`). Use relative time where it
  helps ("2 hours ago") and absolute where precision matters.
- **Round and abbreviate large numbers** in dense UI ("1.2k," "3.4M") but keep full precision where it's
  needed (invoices, counts being acted on). Right-align and use tabular figures for columns of numbers.
- **Never assume name structure** (no required "first/last," honor mononyms and long names) or gender from
  a name.

## Principles that always apply

- **Front-load meaning.** People scan; put the key word first. "Delete draft?" not "Are you sure you want
  to delete this draft?"
- **Be concise, then cut more.** Every extra word costs attention. Remove "please," "just," "simply,"
  and hedge words. Shorter copy is read; long copy is skipped.
- **Be consistent.** One term per concept across the whole product (don't mix "delete/remove/trash" for
  the same action, or "sign in/log in"). Inconsistent vocabulary makes a product feel unreliable.
- **Write the copy against real layout.** Long real strings reveal truncation and wrapping that "Label"
  hides; write and test with realistic content, including the longest plausible case.
