
package com.foodloop_backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Scanner;

public class PasswordGenerator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter new NGO password: ");
        String password = sc.nextLine();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("BCrypt Hash: " + encoder.encode(password));

        sc.close();
    }
}
