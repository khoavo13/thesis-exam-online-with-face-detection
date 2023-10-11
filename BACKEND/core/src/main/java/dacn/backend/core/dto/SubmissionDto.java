package dacn.backend.core.dto;

import dacn.backend.core.entity.StudentAnswer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDto {
    private Long studentId;
    private List<StudentAnswer> content;
}


