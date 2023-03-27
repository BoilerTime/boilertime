import socket
import json
from sys import getsizeof
HOST = "localhost";
PORT = 3002;

s = socket.create_connection((HOST, PORT));
#print("Sec-WebSocket-Version: 13\r\nSec-WebSocket-Key: yyk78LXUpps5XKWmWYmJkw==\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Extensions: permessage-deflate; client_max_window_bits\r\nHost: localhost:3002\r\n\r\n");
#s.send(bytearray("uwu\n", encoding="ASCII"));
#s.send(bytearray("", encoding="ASCII"))
s.send(bytearray("Sec-WebSocket-Version: 13\r\nSec-WebSocket-Key: yyk78LXUpps5XKWmWYmJkw==\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Extensions: permessage-deflate; client_max_window_bits\r\nHost: localhost:3002\r\n\r\n", encoding="ASCII"));
print(s.recv(1024))
s.send(bytearray("Uwu\n", encoding="UTF-8"))
print(s.recv(1024))
print(str(s.recv(1024)))
s.close();
