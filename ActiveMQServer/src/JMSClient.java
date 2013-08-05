import java.util.Hashtable;

import javax.jms.BytesMessage;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.activemq.command.ActiveMQTextMessage;


public class JMSClient {

	public static void main(String[] args) {
		try
		{
			Hashtable env = new Hashtable(); 
			env.put(Context.INITIAL_CONTEXT_FACTORY,"org.apache.activemq.jndi.ActiveMQInitialContextFactory");
			env.put(Context.PROVIDER_URL, "tcp://localhost:61616");
			
			System.out.println("Getting Connection Factory");	
			InitialContext context = new InitialContext(env);
			ConnectionFactory cf = (ConnectionFactory)context.lookup("ConnectionFactory");
			Destination dest = (Destination)context.lookup("dynamicQueues/worklightQueue");
			Connection conn = cf.createConnection();
			
			Session jmsSession = conn.createSession(false,Session.AUTO_ACKNOWLEDGE);
			MessageProducer producer = jmsSession.createProducer(dest);
			
			//sendTextMessage(jmsSession, producer);
			
			sendBytesMessage(jmsSession, producer);
			
			producer.close();
			jmsSession.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static void sendTextMessage(Session jmsSession, MessageProducer producer){
		TextMessage message;
		try {
			message = jmsSession.createTextMessage();
			message.setText("welcome");
			producer.send(message);
			
			Class textMessage = javax.jms.TextMessage.class;
			System.out.println(textMessage.getClass().isAssignableFrom(message.getClass()));
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}
	
	public static void sendBytesMessage(Session jmsSession, MessageProducer producer){
		BytesMessage message;
		try {
			message = jmsSession.createBytesMessage();
			message.writeBytes("HelloWorld".getBytes("UTF-8"));
			producer.send(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

