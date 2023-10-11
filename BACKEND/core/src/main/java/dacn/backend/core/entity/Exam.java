package dacn.backend.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dacn.backend.core.common.enums.ExamTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private Long time;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ExamTypeEnum examType;
    @ManyToOne
    @JoinColumn
    private Subject subject;
    @ManyToOne
    @JoinColumn
    private Semester semester;
    @OneToMany(mappedBy = "exam")
    @JsonIgnore
    private Set<Room> rooms;
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<QuestionExam> questions;
}
