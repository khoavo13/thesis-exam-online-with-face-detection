package dacn.backend.core.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Data
public class QuestionFolder {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private String name;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_folder_id")
    private Set<Question> questions;

    @ManyToOne
    @JoinColumn
    private Subject subject;
}
