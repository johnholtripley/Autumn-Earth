import java.net.*;
import java.io.*;
import java.util.ArrayList;

public class multiServer {

	// create list of all threads
	static ArrayList<Runnable> connectedSockets = new ArrayList<Runnable>();

	public static void main(String[] args) throws IOException {
		ServerSocket serverSocket = null;
		boolean listening = true;

		try {
			serverSocket = new ServerSocket(4444);
		} catch (IOException e) {
			System.err.println("Could not listen on port: 4444.");
			System.exit(-1);
		}

		int i = 0;
		while (listening) {
			multiServerThread mST = new multiServerThread(serverSocket.accept(), i);
			connectedSockets.add(mST);
			Thread newThread = new Thread(mST);
			newThread.start();
			System.out.println("New Thread started - "+i);
			i++;
		}
		serverSocket.close();
	}
	
	public synchronized static void threadBroadcast(int sender, String message) {
		// can get a NULL sent to this method in message when closing flash window ########### - should be fixed now testing for msg=null ?????
		// System.out.println("broadcast received from client"+sender+" - "+message);
		for (int j=0; j<connectedSockets.size(); j++) {
			multiServerThread tempRef = (multiServerThread) connectedSockets.get(j);
			if (tempRef.socketIndex != sender) {
				 // System.out.println("send to "+tempRef.socketIndex);
				tempRef.outputMessage(tempRef.data_out,"client #"+sender+" said: '"+message+"'");
			} 
		}
	}
	
	public synchronized static void removeThread(int sender) {
		System.out.println("removing thread "+sender);
		for (int j=0; j<connectedSockets.size(); j++) {
			multiServerThread tempRef = (multiServerThread) connectedSockets.get(j);
			if (tempRef.socketIndex == sender) {
				connectedSockets.remove(tempRef);
				break;
			} 
		}
		threadBroadcast (-1, "Client #"+sender+" has left or has been disconnected.");
	}
	
}
