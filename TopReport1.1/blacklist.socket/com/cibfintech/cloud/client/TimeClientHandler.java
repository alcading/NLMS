package com.cibfintech.cloud.client;

import org.apache.log4j.Logger;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;

/*
 * @see 处理接收客户端消的息事件
 * @author yyxyz
 * @date 2017年9月29日 11:23:32
 * @version 1.0
 * @since jdk1.6
 */
public class TimeClientHandler extends IoHandlerAdapter {

	private final Logger LOG = Logger.getLogger(TimeClientHandler.class);

	/*
	 * 接收客户端发送的消息
	 */
	// public void messageReceived(IoSession session, Object message) throws
	// Exception {
	// MsgPack mp = (MsgPack) message;
	// System.out.println("收到服务端发来的消息：" + mp.toString());// 显示接收到的消息
	// }

	@Override
	public void messageReceived(IoSession session, Object message) throws Exception {
		// TODO Auto-generated method stub
		// System.out.println("message :"+message);
		LOG.warn("客户端收到消息：" + message);
		if (message.toString().equals("1111")) {
			// 收到心跳包
			LOG.warn("收到心跳包");
			session.write("1112");
		}
		LOG.warn(session);
	}

	@Override
	public void messageSent(IoSession session, Object message) throws Exception {
		// TODO Auto-generated method stub
		super.messageSent(session, message);
	}

	@Override
	public void sessionClosed(IoSession session) throws Exception {
		// TODO Auto-generated method stub
		super.sessionClosed(session);
	}

	@Override
	public void sessionCreated(IoSession session) throws Exception {
		// TODO Auto-generated method stub
		super.sessionCreated(session);
	}

	@Override
	public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
		// TODO Auto-generated method stub
		super.sessionIdle(session, status);
	}

	@Override
	public void sessionOpened(IoSession session) throws Exception {
		// TODO Auto-generated method stub
		super.sessionOpened(session);
	}

	@Override
	public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
		LOG.error("客户端发生异常...", cause);
	}

}