package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dacn.backend.core.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(unique = true)
    private String userNumber;
    private byte[] faceFeature;
    @Column(unique = true, nullable = false)
    private String username;
    private  String password;
    private String email;
    private Role role;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String fullName;


}
