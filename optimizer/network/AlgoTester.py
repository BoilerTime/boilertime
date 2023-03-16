import socket
import json
from sys import getsizeof

HOST = "localhost";
PORT = 3002;

def algoTester(s):
    #Print out some starting messages
    print("\n\n=======================")
    print("Welcome to the BoilerTime Optimization Algorithm Tester!");
    print("This program will as you for some information to get the schedule configured");
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
    i = 0;
    while i < num:
        print("Let's set up course #" + str(i+1));
        print(" What's the name of the class? >>>", end = ' ');
        name = input();
        s.send(bytearray((name+'\n').encode("ascii")));

        cnum = None;
        while cnum is None:
            print(" How many sections are offered of the class? >>>", end = ' ');
            c = input();
            try:
                cnum = int(c);
            except:
                print('\033[91m' + "    Error, you must enter a number of sections, not other characters!" + '\033[0m');
                continue;
        #print(bytearray(c+'\n', "ascii"));
        s.send(bytearray(c+'\n', "ascii"));
        j = 0;
        while j < cnum:
            tnum = None;
            t = None;
            while tnum is None:
                print("     What time is section #" + str(j+1) + " offered at? >>>", end = ' ');
                t = input();
                try:
                    tnum = int(t);
                except:
                    print('\033[91m' + "        Error, you must enter time as an integer, not other characters!" + '\033[0m');
                    continue;
            s.send(bytearray(t+'\n', "ascii"));
            dnum = None;
            d = None;
            while dnum is None:
                print("     How long is section #" + str(j+1) + "? >>>", end = ' ');
                d = input();
                try:
                    dnum = int(d);
                except:
                    print('\033[91m' + "        Error, you must enter duration as an integer, not other characters!" + '\033[0m');
                    continue;
            s.send(bytearray(d+'\n', "ascii"));
            j+=1;
            
        print()
        i+=1;

def getMessageAsJSON(s):
    data = s.recv(1024);
    #print(getsizeof(str(data, "ascii")));
    return json.loads(str(data, "ascii"));

def close(r):
    print("\n\n=======================")
    print("Service has completed its running!")
    print("Closing the connection to the server!");
    print("Result is: " + str(r, "ascii"));
    print("=======================\n")


s = socket.create_connection((HOST, PORT));
s.setblocking(True);
algoTester(s);
close(s.recv(1024));
s.close();