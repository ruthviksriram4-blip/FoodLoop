
package com.foodloop_backend.dto;

public class UserResponse {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String organizationName;
    private String address;
    private Boolean verified;

    public UserResponse(Long userId, String name, String email,
                        String phone, String role,
                        String organizationName, String address,
                        Boolean verified) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.organizationName = organizationName;
        this.address = address;
        this.verified = verified;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public String getAddress() {
        return address;
    }

    public Boolean getVerified() {
        return verified;
    }
}
