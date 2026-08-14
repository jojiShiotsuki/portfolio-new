<?php
/*
  Signing, served from the same host as the proposal itself.

  WHY THIS EXISTS. The page posted its signature straight to a Cloudflare Worker, and on
  15 August Joji's own connection could not open a socket to the two addresses that worker
  answers on. DNS resolved, other Cloudflare hosts connected, his own site connected, and
  those two addresses refused, intermittently, for minutes at a time. A signature was lost to
  it once and falsely reported as failed once.

  The fix is not a better retry. It is removing the second connection. The page is served
  from jojishiotsuki.com, so if a client can READ the proposal they can reach this file: it
  is the same host, the same certificate, the same route that just worked. The hop from here
  to Cloudflare happens from a data centre instead of a home line.

  WHAT IT GUARANTEES. A signature that arrives here is never lost. The worker is tried
  first, because that is where the record, the admin page and the alert live. If the worker
  cannot be reached or answers with a server error, the signature is written to disk here
  AND emailed, and the client is told it succeeded, because by then it HAS. The one thing
  this file must never do is tell somebody their signature is safe when it is nowhere.

  WHAT IT DELIBERATELY DOES NOT DO. It does not validate the signature. The worker already
  does that properly and duplicating those rules here would create two definitions of a
  valid signature that drift apart. A worker REJECTION, meaning any 4xx, is passed straight
  back to the client unchanged: that is a considered answer and the client should see it.
  Only an unreachable worker or a 5xx triggers the local fallback.
*/

declare(strict_types=1);

const WORKER_URL   = 'https://proposal-sign.joji-dev.workers.dev/sign';
const SITE_ORIGIN  = 'https://jojishiotsuki.com';
const NOTIFY_EMAIL = 'jojishiotsuki0@gmail.com';
const MAX_BODY     = 2 * 1024 * 1024;   // a signature is ~90KB; this is a generous ceiling
const WORKER_TIMEOUT = 12;              // seconds, then the fallback takes over

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
/* Same origin only. No CORS headers on purpose: the page that posts here is served from
   this host, so it needs none, and their absence stops any other site posting from a
   browser. */

function reply(array $payload, int $status): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reply(['ok' => false, 'error' => 'Method not allowed.'], 405);
}

$body = file_get_contents('php://input');
if ($body === false || $body === '' || strlen($body) > MAX_BODY) {
    reply(['ok' => false, 'error' => 'Malformed request.'], 400);
}

/* Parsed only to read a few fields for the fallback email and the local filename. The body
   is forwarded to the worker BYTE FOR BYTE regardless, so nothing this file misunderstands
   can change what the worker receives or what gets stored. */
$parsed = json_decode($body, true);
if (!is_array($parsed)) {
    reply(['ok' => false, 'error' => 'Malformed request.'], 400);
}

// --- Try the worker first -------------------------------------------------------------

$workerBody   = null;
$workerStatus = 0;

if (function_exists('curl_init')) {
    $ch = curl_init(WORKER_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            /* The worker gates on Origin and a server to server call carries none, so it
               is stated. It is true: this request originates from that site. The worker's
               real protection is its slug allow list and field validation, which its own
               comment says stand behind this gate. */
            'Origin: ' . SITE_ORIGIN,
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => WORKER_TIMEOUT,
        CURLOPT_CONNECTTIMEOUT => 6,
    ]);
    $result = curl_exec($ch);
    $workerStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($result !== false && $workerStatus > 0) {
        $workerBody = $result;
    }
}

/*
  A considered answer from the worker is the answer. 2xx is a stored signature; 4xx is a
  refusal the client needs to read, such as an unknown slug or a bad email. Both are passed
  through untouched, which also keeps the idempotency reply working: a retry that the worker
  recognises returns the reference it already holds.
*/
if ($workerBody !== null && $workerStatus >= 200 && $workerStatus < 500) {
    http_response_code($workerStatus);
    echo $workerBody;
    exit;
}

// --- The worker did not answer, so this file becomes the record -----------------------

$reference = 'H' . strtoupper(substr(bin2hex(random_bytes(8)), 0, 9));
$stamp     = gmdate('Y-m-d\TH:i:s\Z');

$record = [
    'reference'   => $reference,
    'storedBy'    => 'host-fallback',
    'reason'      => $workerBody === null ? 'worker unreachable' : ('worker status ' . $workerStatus),
    'serverTime'  => $stamp,
    'ip'          => $_SERVER['REMOTE_ADDR'] ?? '',
    'userAgent'   => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 300),
    'payload'     => $parsed,
];

/*
  Two places, because either can fail on its own.

  The file is nearest and keeps the signature image. The directory is protected by its own
  .htaccess: these records hold a client's name, email and signature and must never be
  fetchable over the web.

  The email is what makes the signature survive this server entirely, and it is the half
  Joji actually sees. It carries the details rather than the image, because a base64 PNG
  inside a plain mail body is unreadable and the file has the image anyway.
*/
$savedToDisk = false;
$dir = __DIR__ . '/records';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
if (is_dir($dir) && is_writable($dir)) {
    $savedToDisk = @file_put_contents(
        $dir . '/' . $stamp . '-' . $reference . '.json',
        json_encode($record, JSON_PRETTY_PRINT),
        LOCK_EX
    ) !== false;
}

$emailed = false;
if (function_exists('mail')) {
    $lines = [
        'A proposal was signed, and Cloudflare could not be reached to store it.',
        'This signature is therefore held on the website server and in this email.',
        '',
        'Reason: ' . $record['reason'],
        'Saved to a file on the server: ' . ($savedToDisk ? 'yes' : 'NO, this email is the only copy'),
        '',
        'Reference: ' . $reference,
        'Proposal:  ' . (string) ($parsed['slug'] ?? '(missing)'),
        'Option:    ' . (string) ($parsed['optionId'] ?? '(missing)'),
        'Name:      ' . (string) ($parsed['typedName'] ?? '(missing)'),
        'Title:     ' . (string) ($parsed['typedTitle'] ?? ''),
        'Email:     ' . (string) ($parsed['email'] ?? '(missing)'),
        'Signed by: ' . (($parsed['typedSignature'] ?? false) ? 'typed name' : 'drawing'),
        'Their clock: ' . (string) ($parsed['clientTime'] ?? ''),
        'Server time: ' . $stamp,
        '',
        'The signature image is in the saved file. Record it in Cloudflare by hand when it is reachable.',
    ];
    $emailed = @mail(
        NOTIFY_EMAIL,
        'SIGNED (held on server): ' . (string) ($parsed['typedName'] ?? 'unknown'),
        implode("\n", $lines),
        'From: proposals@jojishiotsuki.com' . "\r\n" . 'Reply-To: ' . (string) ($parsed['email'] ?? NOTIFY_EMAIL)
    );
}

/*
  Only now is the client answered, and only honestly. If the signature reached neither the
  file nor an email then it exists nowhere and saying otherwise would be the exact lie this
  endpoint was built to remove.
*/
if ($savedToDisk || $emailed) {
    reply(['ok' => true, 'reference' => $reference, 'notified' => 'host-fallback'], 200);
}

reply([
    'ok' => false,
    'error' => 'The signature could not be saved. Please email jojishiotsuki0@gmail.com and it will be recorded by hand.',
], 500);
