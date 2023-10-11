package dacn.backend.core.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table
@NoArgsConstructor
@Data
@AllArgsConstructor
public class UserRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    @ManyToOne
    private Users user;
    @ManyToOne
    private Room room;
    // For Student
    private Double score;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_room_id")
    private List<UnusualAction> unusualActions;
    private String socketId;
}
