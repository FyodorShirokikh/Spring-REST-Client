package ru.kata.spring.restclient.api;


import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import ru.kata.spring.restclient.api.configuration.MyConfig;
import ru.kata.spring.restclient.api.entity.User;

import java.util.List;

public class SpringBootRestApiClientApplication {
	public static void main(String[] args) {
		AnnotationConfigApplicationContext context =
				new AnnotationConfigApplicationContext(MyConfig.class);
		Communication communication = context.getBean("communication",
				Communication.class);
		List<User> allUsers = communication.getAllUsers();
		System.out.println(allUsers);

		User userAdd = new User(3L, "James", "Brown", (byte) 26);
		String cookies = communication.saveUser(userAdd);

		User userEdit = new User(3L, "Thomas", "Shelby", (byte) 26);
		communication.editUser(userEdit, cookies);

		communication.deleteUser(3L, cookies);

	}

}
