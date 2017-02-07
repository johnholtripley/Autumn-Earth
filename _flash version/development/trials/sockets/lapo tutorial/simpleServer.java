/*
 * simpleServer.java
 *
 * Created on 8 dicembre 2003, 14.56
 */

import java.io.*;
import java.net.*;


public class simpleServer
{
        
    public static void main(String args[])
    {
        // Message terminator
        char EOF = (char)0x00;
        
        try
        {
            // create a serverSocket connection on port 9999
            ServerSocket s = new ServerSocket(9999);
            
            System.out.println("Server started. Waiting for connections ...");
            // wait for incoming connections
            Socket incoming = s.accept();
            
            BufferedReader data_in = new BufferedReader(new InputStreamReader(incoming.getInputStream()));
            PrintWriter data_out = new PrintWriter(incoming.getOutputStream());
            
            data_out.println("Welcome! type EXIT to quit." + EOF);
            data_out.flush();
            
            boolean quit = false;
            
            // Waits for the EXIT command
            while (!quit)
            {
                String msg = data_in.readLine();
                
                if (msg == null) quit = true;
                
                if (!msg.trim().equals("EXIT"))
                {
                    data_out.println("You sayed: <b>" + msg.trim() + "</b>" + EOF);
                    data_out.flush();
                }
                else
                {
                    quit = true;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println("Connection lost");
        }
    }
    
}
