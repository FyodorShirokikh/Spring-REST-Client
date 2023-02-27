package ru.kata.spring.restclient.api;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ru.kata.spring.restclient.api.entity.User;
import java.util.List;

@Component
public class Communication {
    private final RestTemplate restTemplate;
    private final String URL = "http://94.198.50.185:7081/api/users";
    public Communication(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<User> getAllUsers() {
        ResponseEntity<List<User>> responseEntity =
                restTemplate.exchange(URL, HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<User>>() {});
        List<User> allUsers = responseEntity.getBody();
        return allUsers;
    }

    public User getUser(Long id) {
        User user = restTemplate.getForObject(URL + "/" + id,
                User.class);
        return user;
    }

    public String saveUser(User user) {
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(URL, user, String.class);
        System.out.println("Added new user");
        System.out.println(responseEntity.getBody());

        HttpHeaders responseHeaders = responseEntity.getHeaders();
        String cookies = responseHeaders.getFirst("Set-Cookie");
        return cookies;
    }

    public void editUser(User user, String cookies) {
        Long id = user.getId();
        HttpHeaders  headers = new HttpHeaders();
        headers.add("Cookie", cookies);
        HttpEntity<User> entity = new HttpEntity<User>(user,headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(URL, HttpMethod.PUT, entity, String.class);
        System.out.println("User with ID = " + id + " was updated");
        System.out.println(responseEntity.getBody());
    }

    public void deleteUser(Long id, String cookies) {
        String delUrl = URL + "/" + id;
        HttpHeaders  headers = new HttpHeaders();
        headers.add("Cookie", cookies);
        HttpEntity<User> entity = new HttpEntity<User>(headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(delUrl, HttpMethod.DELETE, entity, String.class);
        System.out.println("User with ID = " + id + " was deleted");
        System.out.println(responseEntity.getBody());
    }

}
