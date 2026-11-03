import subprocess
import json
import time
import threading
import queue

# Spawn the MCP stdio server
proc = subprocess.Popen(
    ["bun", "run", "server/mcp.ts"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)

out_queue = queue.Queue()

def drain():
    while True:
        line = proc.stdout.readline()
        if not line:
            break
        out_queue.put(line.rstrip("\r\n"))

threading.Thread(target=drain, daemon=True).start()

req_id = [1]

def send(method, params=None):
    req = {"jsonrpc": "2.0", "id": req_id[0], "method": method, "params": params or {}}
    req_id[0] += 1
    proc.stdin.write(json.dumps(req) + "\n")
    proc.stdin.flush()

def read_response(timeout=15):
    end = time.time() + timeout
    while time.time() < end:
        try:
            line = out_queue.get(timeout=0.1)
        except queue.Empty:
            continue
        if not line.strip():
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue
        if "id" in msg and "result" in msg:
            return msg
    return None

def show(label, res):
    print("=" * 60)
    print(f">>> {label}")
    if res is None:
        print("(no response / timeout)")
    else:
        print(json.dumps(res, indent=2, default=str)[:4000])
    return res

# 1. tools/list
show("1. tools/list", read_response())

# 2. list_components
show("2. list_components", read_response())

# 3. list_categories (if needed)
show("3. list_categories", read_response())

# 4. get_component_schema for form and button
res = show("4a. get_component_schema(form)", read_response())
form_schema = res
res = show("4b. get_component_schema(button)", read_response())
button_schema = res

# 5 & 6. create_component for form and button
show("5. create_component(form)", read_response())
show("6. create_component(button)", read_response())

# 7. suggest_connection
show("7. suggest_connection(form, button)", read_response())

# 8. find_safe_connections(form)
show("8. find_safe_connections(form)", read_response())

# 9. validate_connection(form.isValid -> button.disabled)
show("9. validate_connection(form.isValid -> button.disabled)", read_response())

# 10. create_connection(form.isValid -> button.disabled, inv)

send("tools/call", {"name": "create_connection", "arguments": {
    "source": "form", "sourcePort": "isValid", "target": "button", "targetPort": "disabled", "transform": "invert"
}})
res = read_response()
print("=" * 60)
print(">>> 10. create_connection(form.isValid -> button.disabled, invert)")
print(json.dumps(res, indent=2, default=str)[:4000])

# 11. list_connections
show("11. list_connections", read_response())

# Cleanup
try:
    proc.terminate()
    proc.wait(timeout=5)
except Exception:
    proc.kill()

print("=" * 60)
print("DONE")
