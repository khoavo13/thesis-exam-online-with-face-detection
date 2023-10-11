package dacn.backend.core.repository;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByIdAndRole(Long id, Role role);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByUsernameAndPassword(String username, String password);

}
