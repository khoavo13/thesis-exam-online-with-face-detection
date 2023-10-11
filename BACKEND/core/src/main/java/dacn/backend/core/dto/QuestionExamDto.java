package dacn.backend.core.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionExamDto {
    private Double score;
    private Long questionId;
}
