import org.apache.activemq.broker.BrokerService;
import org.apache.activemq.ActiveMQConnectionFactory;
 
import javax.jms.*;
 
public class Server implements MessageListener {
    private static int ackMode;
    private static String messageQueueName;
    private static String messageBrokerUrl;
 
    private Session session;
    private boolean transacted = false;
    private MessageProducer replyProducer;
 
    static {
        messageBrokerUrl = "tcp://localhost:61616";
        messageQueueName = "worklightQueue";
        ackMode = Session.AUTO_ACKNOWLEDGE;
    }
 
    public Server() {
        try {
            //This message broker is embedded
            BrokerService broker = new BrokerService();
            broker.setPersistent(false);
            broker.setUseJmx(false);
            broker.addConnector(messageBrokerUrl);
            broker.start();
        } catch (Exception e) {
            //Handle the exception appropriately
        }
 
        //Delegating the handling of messages to another class, instantiate it before setting up JMS so it
        //is ready to handle messages
        this.setupMessageQueueConsumer();
    }
 
    private void setupMessageQueueConsumer() {
        ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(messageBrokerUrl);
        Connection connection;
        try {
            connection = connectionFactory.createConnection();
            connection.start();
            this.session = connection.createSession(this.transacted, ackMode);
            Destination adminQueue = this.session.createQueue(messageQueueName);
 
            //Setup a message producer to respond to messages from clients, we will get the destination
            //to send to from the JMSReplyTo header field from a Message
            this.replyProducer = this.session.createProducer(null);
            this.replyProducer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
 
            //Set up a consumer to consume messages off of the admin queue
            MessageConsumer consumer = this.session.createConsumer(adminQueue);
            consumer.setMessageListener(this);
        } catch (JMSException e) {
            //Handle the exception appropriately
        }
    }
 
    public void onMessage(Message message) {
    	
        try {
        	String myMessage = ((TextMessage)message).getText();
        	System.out.println(myMessage);
            TextMessage response = this.session.createTextMessage();
            if (message instanceof TextMessage) {
                TextMessage txtMsg = (TextMessage) message;
                String messageText = txtMsg.getText();
                response.setText(messageText);
            }
 
            //Set the correlation ID from the received message to be the correlation id of the response message
            //this lets the client identify which message this is a response to if it has more than
            //one outstanding message to the server
            response.setJMSCorrelationID(message.getJMSCorrelationID());
 
            //Send the response to the Destination specified by the JMSReplyTo field of the received message,
            //this is presumably a temporary queue created by the client
            Destination replyDest = message.getJMSReplyTo();
            
            if(replyDest != null){
            	if(myMessage.equals("bytes")){
            		BytesMessage bytesMessage = this.session.createBytesMessage();
            		bytesMessage.writeBytes("HelloWorld".getBytes("UTF-8"));
            		this.replyProducer.send(replyDest, bytesMessage);
            	}else{
            		this.replyProducer.send(replyDest, response);
            	}
            }
        } catch (Exception e) {
            //Handle the exception appropriately
        	e.printStackTrace();
        }
    }
 
    public static void main(String[] args) {
        new Server();
    }
}