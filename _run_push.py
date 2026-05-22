import subprocess, os
D = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(D, '_github-push-log.txt')
lines = ['=== GitHub push log ===']
def run(cmd):
    lines.append('>>> ' + ' '.join(cmd))
    p = subprocess.run(cmd, cwd=D, capture_output=True, text=True)
    out = (p.stdout or '') + (p.stderr or '')
    lines.append(out.rstrip() if out.strip() else '(exit %s)' % p.returncode)
    return p.returncode
if not os.path.isdir(os.path.join(D, '.git')):
    run(['git', 'init'])
else:
    lines.append('>>> .git already exists')
run(['git', 'status'])
run(['git', 'add', '-A'])
if subprocess.run(['git', 'diff', '--cached', '--quiet'], cwd=D).returncode != 0:
    run(['git', 'commit', '-m', 'Add Thang Doan portfolio website'])
else:
    lines.append('>>> no changes to commit')
gh_auth = run(['gh', 'auth', 'status'])
authenticated = gh_auth == 0
rem = subprocess.run(['git', 'remote', '-v'], cwd=D, capture_output=True, text=True)
lines.append('>>> git remote -v')
lines.append((rem.stdout or '') + (rem.stderr or ''))
has_origin = 'origin' in (rem.stdout or '')
push_skipped = False
push_ok = False
repo_url = ''
if has_origin:
    u = subprocess.run(['git', 'rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], cwd=D, capture_output=True, text=True)
    lines.append('>>> git upstream check')
    lines.append((u.stdout or '') + (u.stderr or ''))
    if u.returncode == 0:
        ahead = subprocess.run(['git', 'rev-list', '--count', '@{u}..HEAD'], cwd=D, capture_output=True, text=True)
        if (ahead.stdout or '0').strip() == '0':
            push_skipped = True
            lines.append('>>> skip gh repo create: origin exists and no unpushed commits')
    run(['git', 'status', '-sb'])
if authenticated and not push_skipped and not has_origin:
    rc = run(['gh', 'repo', 'create', 'thang-doan-portfolio', '--public', '--source=.', '--remote=origin', '--push'])
    push_ok = rc == 0
    if push_ok:
        v = subprocess.run(['gh', 'repo', 'view', 'thang-doan-portfolio', '--json', 'url', '-q', '.url'], cwd=D, capture_output=True, text=True)
        repo_url = (v.stdout or '').strip()
        lines.append('REPO_URL=' + repo_url)
elif not authenticated:
    lines.append('MANUAL: gh auth login')
    lines.append('MANUAL: cd ' + D)
    lines.append('MANUAL: gh repo create thang-doan-portfolio --public --source=. --remote=origin --push')
lines.append('PUSH_SUCCEEDED=' + str(push_ok))
lines.append('GH_AUTHENTICATED=' + str(authenticated))
open(LOG, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('\n'.join(lines[-25:]))
