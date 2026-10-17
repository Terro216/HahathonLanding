#!/usr/bin/env python3
"""Real static server checks; POST probes contain no data."""
import argparse
import hashlib
import json
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

p = argparse.ArgumentParser()
p.add_argument('base')
p.add_argument('--manifest')
a = p.parse_args()
checks = 0

def get(path, code=200, method='GET'):
    global checks
    req = Request(urljoin(a.base.rstrip('/')+'/', path), method=method, data=b'' if method=='POST' else None)
    try:
        with urlopen(req, timeout=15) as r:
            status, body, headers = r.status, r.read(), r.headers
    except HTTPError as e:
        status, body, headers = e.code, e.read(), e.headers
    assert status == code, (path, status, code)
    checks += 1
    return body, headers

html, h = get('')
assert 'CreativeHack 2022' in html.decode()
assert 'Регистрация прошла успешно' not in html.decode()
for v in ["connect-src 'none'", "form-action 'none'", "frame-src 'none'"]:
    assert v in h['Content-Security-Policy']
assert h['X-Content-Type-Options'] == 'nosniff'
assert h['Referrer-Policy'] == 'no-referrer'
get('healthz')
get('team', 404)
get('team', 405, 'POST')
get('', 405, 'POST')
for path in ['.git/config', 'src/main.js', 'package.json', 'index.js.map', '50x.html', 'nonexistent']:
    get(path, 404)
for name in ['rules', 'privacy']:
    data, head = get(f'documents/creativehack-2022-{name}.pdf')
    assert data.startswith(b'%PDF') and head.get_content_type() == 'application/pdf'
get('og_image.png')
assert b'https://creativehack.ilyamedve.dev/' in get('sitemap.xml')[0]
assert b'Allow: /' in get('robots.txt')[0]
if a.manifest:
    for line in open(a.manifest):
        expected, name = line.strip().split(None, 1)
        actual, _ = get(name.removeprefix('./'))
        assert hashlib.sha256(actual).hexdigest() == expected, name
print(json.dumps({'result': 'passed', 'http_checks': checks, 'base': a.base, 'manifest_verified': bool(a.manifest)}))
