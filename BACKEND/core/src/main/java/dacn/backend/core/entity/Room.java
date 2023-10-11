package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dacn.backend.core.common.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private RoomStatus status;
    private Long capacity;
    private String groupName;

    @ManyToOne
    @JoinColumn
    private Exam exam;
}
