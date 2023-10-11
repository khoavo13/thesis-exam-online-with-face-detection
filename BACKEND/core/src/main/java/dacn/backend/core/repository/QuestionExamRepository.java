package dacn.backend.core.repository;

import dacn.backend.core.entity.QuestionExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface QuestionExamRepository extends JpaRepository<QuestionExam, Long> {
}
