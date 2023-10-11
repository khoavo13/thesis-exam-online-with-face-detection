package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn
    private Users student;

    @OneToOne
    @JoinColumn
    @JsonIgnore
    private Exam exam;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<StudentAnswer> answers;
}
