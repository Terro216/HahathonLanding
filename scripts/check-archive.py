#!/usr/bin/env python3
"""Preservation and privacy checks independent of the build/browser."""
import hashlib
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
origin = json.loads((root / 'archive/origin.json').read_text())
checked = 0
for name, expected in origin['git_blob_sha1'].items():
    if name.startswith(('src/assets/', 'src/fonts/', 'src/styles/')) or name == 'src/og_image.png':
        data = (root / name).read_bytes()
        actual = hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest()
        assert actual == expected, f'Original asset/style changed: {name}'
        checked += 1
for item in json.loads((root / 'archive/documents.json').read_text()):
    assert hashlib.sha256((root / item['file']).read_bytes()).hexdigest() == item['sha256']
js = (root / 'src/main.js').read_text()
assert not re.search(r'fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|onSubmit', js)
source = '\n'.join(p.read_text() for p in (root / 'src').rglob('*.pug'))
for forbidden in ['recaptcha', 'mailto:', 'Регистрация прошла успешно', 'hack.rtuitlab.dev']:
    assert forbidden not in source, forbidden
assert 'fieldset.archive-fields(disabled)' in source
assert '18.10.2022 20:00' in source and '21.10.2022 09:00' in source
assert 'Двое из ларца' in source and 'Reality Zero' in source
print(f'Archive checks passed: {checked} original assets/fonts/block styles unchanged; PDF hashes, dates, winners and no submission APIs verified.')
