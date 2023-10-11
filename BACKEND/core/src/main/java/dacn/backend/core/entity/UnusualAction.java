package dacn.backend.core.entity;

import dacn.backend.core.common.enums.UnusualType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnusualAction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private LocalDateTime occurTime;
    private UnusualType type;
    private String description;

}
