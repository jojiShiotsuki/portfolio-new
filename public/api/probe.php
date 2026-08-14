<?php
/*
  A tombstone, not a probe.

  This file used to report the host's PHP version, its extensions, and whether it could
  reach the signing worker. It has answered all of that and should be gone.

  It is still here because deleting it from the repository does NOT remove it from the
  server. The deploy uploads the built folder over FTP and never deletes anything that is
  no longer in it, so a file removed from git stays live on the host forever, still serving
  its last uploaded contents. Deleting the source and pushing left the old probe answering
  200 exactly as before, which is worth remembering the next time something is "removed"
  from this site.

  So the only way to retire a file here is to overwrite it with one that does nothing. That
  is what this is. Anything genuinely sensitive would need deleting over FTP by hand.
*/
http_response_code(410);
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
echo json_encode(['ok' => false, 'error' => 'Gone.']);
