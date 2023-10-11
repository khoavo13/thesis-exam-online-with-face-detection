package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    @JsonIgnore
    private Long id;
    @ManyToOne
    @JsonIgnore
    @JoinColumn
    private Submission submission;
    @ManyToOne
    @JoinColumn
    private QuestionExam question;
    private String content;
    private Double score;
}
