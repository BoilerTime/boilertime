import socket
import json

HOST = "localhost";
PORT = 3002;

def algoTester(s):
    #Print out some starting messages
    print("\n\n=======================")
    print("Welcome to the BoilerTime Optimization Algorithm Tester!");
    print("This program will as you for some information to get the schedule configured");
    print("© 2023 Onyx Mayer");
    print("=======================\n\n")

    #Next, get the number of classes that the user would like to use

    status = -1;
    while status != 200:
        print("How many classes are you entering?", end=' ')
        num = input();
        nnum = None;
        try:
            nnum = int(num);
        except:
            print("Error, you must enter a number of courses. not other characters!");
            continue;

        if nnum < 1 or nnum > 10:
            print("Error, the server couldn't processes the number of classes you inputted. Please try again!");
            continue;
        num = num + "\n";
        s.send(bytearray(num.encode("ascii")));
        res = getMessageAsJSON(s);
        status = res["status"];
        #print("Got a response" + str(res["status"]));
        if status != 200:
            print("Error, the server couldn't processes the number of classes you inputted. Please try again!");
    num = int(num); #cast to an integer to loop over in the future

    print()
    for i in range(num):
        print(">>Let's set up course #" + str(i+1));

def getMessageAsJSON(s):
    res = '';
    data = s.recv(1024);
    while data:
        res += str(data, "ascii");
        data = s.recv(1024);
    return json.loads(res);

s = socket.create_connection((HOST, PORT));
s.setblocking(True);
algoTester(s);
print("Closing Connection to Server!");
s.close();