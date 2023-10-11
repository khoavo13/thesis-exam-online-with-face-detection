package dacn.backend.core.repository;

import dacn.backend.core.entity.UnusualAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnusualActionRepository extends JpaRepository<UnusualAction, Long>{
//    List<UnusualAction> findAllByStudentId(Long studentId);
}
