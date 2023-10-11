package dacn.backend.core.repository;

import dacn.backend.core.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>{
    Submission findByStudentIdAndExamId(Long studentId, Long examId);
}
