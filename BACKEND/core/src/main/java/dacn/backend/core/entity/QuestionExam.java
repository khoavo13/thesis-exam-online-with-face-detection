package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionExam {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private Double score;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Exam exam;

    @ManyToOne
    @JoinColumn
    private Question content;
}
