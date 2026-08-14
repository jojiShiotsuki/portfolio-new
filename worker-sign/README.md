# proposal-sign

This is the small server that catches a signature when a client signs a proposal on
jojishiotsuki.com. It checks the signature is real, saves it, and emails you that it
happened.

You set this up once. After that you never touch it again, except to add a line when you
write a new proposal (see "Adding a new proposal" at the bottom).

## What it does

- `POST /sign` takes the signature from the proposal page, checks every field, saves it,
  and replies with a short reference code like `K7M2QX9BTV`.
- `GET /signatures` shows you everything that has been signed. It is locked behind a
  password only you have.

Everything is checked before it is saved: the drawing has to be a real PNG image and under
400KB, the name and email have to be there and be sensible, and the proposal has to be one
of the ones listed inside the worker. That last one matters. Without it, anyone who found
the web address could use it to store files for free.

## Setup: run these once

Open PowerShell. Run one line at a time and read what comes back before running the next.

### 1. Go to the folder and install the tools

```
cd C:\Users\Shiot\Projects\portfolio-new\worker-sign
```

```
npm install
```

```
npx wrangler login
```

That last one opens your browser. Approve it, then come back to PowerShell.

### 2. Make the storage box and put its id in the config

```
npx wrangler kv namespace create SIGNATURES
```

That prints a block of text with an `id = "..."` in it. Copy the long id.

Open `wrangler.toml` in this folder. Near the bottom there is a line that says `id = ""`.
Paste the id between the two quote marks and save the file.

It should end up looking like `id = "a1b2c3d4e5f6..."` with your own id in it.

### 3. Put it live

```
npx wrangler deploy
```

When it finishes it prints a web address. It should be:

```
https://proposal-sign.joji-dev.workers.dev
```

If it prints something different, tell whoever is working on the site, because the proposal
page is pointing at that exact address.

### 4. Make a password so only you can read the signatures

First, make a random password and put it straight on your clipboard. It never appears on
screen, so it cannot end up pasted into a chat by accident:

```
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ }) | Set-Clipboard
```

Now hand it to Cloudflare. This next command asks you for the value and hides it while you
type. Press Ctrl+V to paste, then press Enter:

```
npx wrangler secret put ADMIN_TOKEN
```

Then save that password somewhere you keep passwords, because your clipboard will not hold
it for long. Do not put it in a text file in this project.

Until you do this step, `GET /signatures` refuses to answer anyone at all. It never runs
without a password.

### 5. Check it is alive

```
Invoke-RestMethod -Uri "https://proposal-sign.joji-dev.workers.dev/signatures"
```

You should get a `401 Unauthorized` error. That is the correct answer. It means the lock is
on.

That is the setup finished. The proposal page will now work.

## Reading your signatures

Three lines. The first one asks for your password and hides it while you type it.

```
$secure = Read-Host -Prompt "Admin token" -AsSecureString
```

```
$token = [System.Net.NetworkCredential]::new("", $secure).Password
```

```
Invoke-RestMethod -Uri "https://proposal-sign.joji-dev.workers.dev/signatures" -Headers @{ Authorization = "Bearer $token" }
```

That gives you a list, newest first: who signed, their email, which option they picked, and
the exact time on the server's clock. It does not include the signature drawing, because
the drawings are large and you rarely need them.

To pull one full record including the drawing, use its reference code:

```
Invoke-RestMethod -Uri "https://proposal-sign.joji-dev.workers.dev/signatures?reference=K7M2QX9BTV" -Headers @{ Authorization = "Bearer $token" }
```

Swap `K7M2QX9BTV` for the reference you want. The `drawing` field in the result is the
signature image. Paste it into a browser address bar to see it.

When you are done, close the PowerShell window so the password is not sitting in memory.

## Optional: get an email when someone signs

You can skip this entirely. Without it, signing still works perfectly, the record is still
saved, and the reply just says notification was skipped. Nothing breaks.

If you want the email:

1. Make a free account at resend.com.
2. Verify the domain jojishiotsuki.com inside Resend. It walks you through adding a few DNS
   records. Until the domain is verified, Resend will refuse to send.
3. Create an API key in Resend and copy it.
4. Hand it over the same hidden way as before:

```
npx wrangler secret put RESEND_API_KEY
```

Paste the key at the prompt and press Enter.

The address it emails is already set in `wrangler.toml` as `NOTIFY_EMAIL`. Change that line
if you want it going somewhere else, then run `npx wrangler deploy` again.

If Resend is down or the key is wrong, the client still signs successfully. The email is
the only thing that is missed, and the record is still in storage waiting for you.

## Adding a new proposal

Two files, both in this project.

1. In `lib/proposals/index.ts`, add the proposal the normal way.
2. In `worker-sign/src/index.ts`, find `KNOWN_SLUGS` near the top and add the new slug to
   the list, exactly as it is written in the proposal file.

Then:

```
cd C:\Users\Shiot\Projects\portfolio-new\worker-sign
```

```
npx wrangler deploy
```

If you skip step 2, the proposal page loads fine and looks fine, but signing it fails with
"This proposal link is not valid". That is the guard doing its job, not a bug.

## The limits it enforces

- 5 signature attempts from the same internet connection per hour.
- 40 signatures in total across all clients per day.
- 400KB maximum for the signature drawing.
- 1.2MB maximum for the whole request.

If a real client ever hits one of these, raise the numbers at the top of
`worker-sign/src/index.ts` and deploy again.

## A note on the typed name

Some people cannot draw a signature with a mouse or a trackpad. The proposal page lets them
type their name instead. When they do, the page writes their name into the signature image
and captions it "Typed signature", so the record still has something to look at, and it
also sets a flag. The worker stores that as `drawn: false`, so you can tell the two apart
in the list without opening a single image. The typed name is required either way, so a
saved signature is never anonymous.
