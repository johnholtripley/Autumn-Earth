import java.net.*;
import java.io.*;

public class multiServerThread implements Runnable {
	public Socket socket = null;
	public int socketIndex;
	public char EOF = (char)0x00;
	PrintWriter data_out = null;
		
	public multiServerThread(Socket socket, int socketIndex) {
		
		this.socket = socket;
		this.socketIndex = socketIndex;
	}
	
	public void run() {
	
		try {
			try {
		
				BufferedReader data_in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
				
				data_out = new PrintWriter(socket.getOutputStream());
				
				outputMessage(data_out, "Welcome to socket #"+socketIndex+"! type EXIT to quit.");
				
				boolean quit = false;
				// Waits for the EXIT command
				while (!quit) {
					String msg = data_in.readLine();
					
					if (msg == null) {
						quit = true;
					} else {
					
						if (!msg.trim().equals("EXIT")) {
			
							// outputMessage(data_out, "you said: "+msg.trim());
							
							multiServer.threadBroadcast(socketIndex,msg.trim());
						} else {
							quit = true;
						}
					}
				}
			
				multiServer.removeThread(socketIndex);
				data_out.close();
				data_in.close();
				socket.close();
		
			} catch (IOException e) {
				System.out.println("Connection lost"+e);
			}
		
		} catch (NullPointerException e) {
			// check out this exception - do I need to close streams and socket? ##############
			System.out.println("Client lost or closed"+e);
			// need to remove this thread from the main list:
			multiServer.removeThread(socketIndex);
		}
	}
	
	public void outputMessage(PrintWriter printerRef, String output) {
	
		printerRef.println(output+EOF);
		printerRef.flush();
	}

}


