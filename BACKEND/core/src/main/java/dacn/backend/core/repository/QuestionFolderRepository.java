package dacn.backend.core.repository;

import dacn.backend.core.entity.QuestionFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionFolderRepository extends JpaRepository<QuestionFolder, Long>{
}
