package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dacn.backend.core.common.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private QuestionType type;
    @Column(columnDefinition = "text", length = 10485760)
    private String description;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private Set<AnswerOption> answerOptions;

    @OneToOne
    @JoinColumn
    @JsonIgnore
    private AnswerOption solution;

}
