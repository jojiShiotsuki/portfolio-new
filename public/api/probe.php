<?php
/*
  A one-off probe, deployed to find out three things about the host before any real code is
  written against it:

    1. Does this host execute PHP at all, or serve the file as text?
    2. Which version, since the signing endpoint needs 7.4 or newer for its syntax.
    3. Can the host reach the Cloudflare worker outbound, which is the whole premise of
       proxying through here rather than from the browser.

  It returns no secrets and takes no input. Delete it once the answers are known.
*/
header('Content-Type: application/json');

$workerReachable = false;
$workerStatus = null;
$workerError = null;

if (function_exists('curl_init')) {
    // A POST the worker will REJECT on purpose. A 400 back is proof of a completed round
    // trip, which is what is being measured. Nothing is written by this.
    $ch = curl_init('https://proposal-sign.joji-dev.workers.dev/sign');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => '{"slug":"host-probe-only"}',
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $body = curl_exec($ch);
    $workerStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $workerError = curl_error($ch) ?: null;
    curl_close($ch);
    $workerReachable = $workerStatus > 0;
}

echo json_encode([
    'php' => PHP_VERSION,
    'curl' => function_exists('curl_init'),
    'json' => function_exists('json_encode'),
    'mail' => function_exists('mail'),
    'writable_tmp' => is_writable(sys_get_temp_dir()),
    'worker_reachable_from_host' => $workerReachable,
    'worker_status' => $workerStatus,
    'worker_error' => $workerError,
], JSON_PRETTY_PRINT);
