#!/usr/bin/env python3
"""Sanitized container identity snapshot. Run on big-one, never save full inspect."""
import argparse
import json
from pathlib import Path
import socket
import subprocess

p=argparse.ArgumentParser()
p.add_argument('action', choices=['snapshot','compare'])
p.add_argument('file', type=Path)
a=p.parse_args()
assert socket.gethostname().split('.')[0]=='big-one', 'Use big-one'
ids=subprocess.check_output(['docker','ps','-q'],text=True).split()
items=json.loads(subprocess.check_output(['docker','inspect',*ids]))
now={i['Name'].lstrip('/'):{'id':i['Id'],'image':i['Image'],'started':i['State']['StartedAt'],'restarts':i['RestartCount']} for i in items}
if a.action=='snapshot':
    a.file.parent.mkdir(parents=True,exist_ok=True)
    a.file.write_text(json.dumps(now,indent=2)+'\n')
    print(json.dumps({'snapshot':str(a.file),'running_containers':len(now)}))
else:
    before=json.loads(a.file.read_text())
    changed={k:{'before':v,'after':now.get(k)} for k,v in before.items() if now.get(k)!=v}
    result={'unchanged':len(before)-len(changed),'changed':changed,'added':sorted(now.keys()-before.keys())}
    a.file.with_name('neighbors-after.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result))
