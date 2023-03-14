import socket;

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("localhost", 3002))
    s.sendall(b"Hello, world")
    data = s.recv(1024)

print(f"Received {data!r}")